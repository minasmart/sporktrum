(ns sporktrum.core)

(enable-console-print!)

(def canvas-dom (.getElementById js/document "spectrum"))
(def width (.-width canvas-dom))
(def height (.-height canvas-dom))
(def ctx (.getContext canvas-dom "2d"))
(def gradient (.createLinearGradient ctx 0 height 0 0))
(.addColorStop gradient 0 "#8ED6FF")
(.addColorStop gradient 1 "#FF8800")
(set! (.-font ctx) "16px Helvetica, Arial")
(set! (.-strokeStyle ctx) "#8A8A8A")


(def constraints (js-obj "video" false "audio" true))

(if (not js/navigator.getUserMedia)
  (.alert js/window "getUserMedia not supported"))

; Storage for things that get GCed unless you hang on to them.
(def refs (atom {}))

(defn to-non-typed-array
  "Convert a typed array to an array"
  [typed-array]
  (.apply js/Array [] typed-array))

(defn freq-for-bin
  "Get the corresponding frequency for a bin in the fft"
  [bin-index]
  (* bin-index (/ (:sample-rate @refs) (:fft-size @refs))))

(defn draw
  "Draw the spectrum"
  []
  (js/requestAnimationFrame draw)
  (let [analyser (:analyser @refs)
        freq-data (:freq-data @refs)
        upper-idx (:upper-idx @refs)
        line-x (* (/ (:line-idx @refs) upper-idx) width)]

    (.getByteFrequencyData analyser freq-data)
    (set! (.-fillStyle ctx) "black")
    (.fillRect ctx 0 0 width height)

    (.beginPath ctx)
    (.moveTo ctx line-x 0)
    (.lineTo ctx line-x height)
    (.stroke ctx)

    (set! (.-fillStyle ctx) gradient)
    (let [simple-freq-data (to-non-typed-array freq-data)
          len (count simple-freq-data)]

      ; reset and start
      (.beginPath ctx)
      (.moveTo ctx 0 height)

      (dotimes [idx upper-idx]
        (let [mag (get simple-freq-data idx)
              x (* (/ idx upper-idx) width)
              y (- height (* (/ mag 255) height))]
          (.lineTo ctx x y)))

      (.lineTo ctx width height)
      (.fill ctx)

      (let [highest-mag (apply max (take upper-idx simple-freq-data))
            idx (.indexOf simple-freq-data highest-mag)
            freq (freq-for-bin idx)]
        (set! (.-fillStyle ctx) "#8A8A8A")
        (.fillText ctx (str (js/parseInt freq 10) "Hz") (- width 70) 20)
        ))))

(defn stream-fn
  "User media stream callback"
  [stream]
  (let [context (js/AudioContext.)
        source (.createMediaStreamSource context stream)
        analyser (.createAnalyser context)]

    ; set the fft size
    (set! (.-fftSize analyser) 2048)
    (set! (.-minDecibels analyser) -100)
    (set! (.-maxDecibels analyser) -20)
    (set! (.-smoothingTimeConstant analyser) 0.9)

    ; connect the analyser
    (.connect source analyser)

    ; Save a handle to the source and analyser
    (swap! refs assoc :source source)
    (swap! refs assoc :analyser analyser)

    (swap! refs assoc :sample-rate (.-sampleRate context))
    (swap! refs assoc :fft-size (.-fftSize analyser))
    (swap! refs assoc :freq-bin-count (.-frequencyBinCount analyser))
    (swap! refs assoc :freq-data (js/Uint8Array. (:freq-bin-count @refs)))

    (let [freqs (map #(freq-for-bin %) (range 0 (:freq-bin-count @refs)))
          arr-freqs (apply array freqs)
          closest-to-cap (apply min-key #(Math/abs (- 5000 %)) freqs)
          closest-to-voice (apply min-key #(Math/abs (- 200 %)) freqs)]
      (swap! refs assoc :upper-idx (.indexOf arr-freqs closest-to-cap))
      (swap! refs assoc :line-idx (.indexOf arr-freqs closest-to-voice))
      )

    (js/requestAnimationFrame draw)))

(defn err-callback
  "Handle the error if stream creation failed"
  [err]
  (println err))

(.getUserMedia js/navigator constraints stream-fn err-callback)
