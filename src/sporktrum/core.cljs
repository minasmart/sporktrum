(ns sporktrum.core (:require [sporktrum.util :as u]))

(enable-console-print!)

(set! (.-getUserMedia js/navigator)
      (or (.-getUserMedia js/navigator)
          (.-webkitGetUserMedia js/navigator)
          (.-mozGetUserMedia js/navigator)
          (.-msGetUserMedia js/navigator)))

(set! (.-AudioContext js/window)
      (or (.-AudioContext js/window)
          (.-webkitAudioContext js/window)))

(def canvas-dom (.getElementById js/document "spectrum"))
(def width (.-width canvas-dom))
(def height (.-height canvas-dom))
(def spectrum-baseline (- height 20))
(def ctx (.getContext canvas-dom "2d"))
(def gradient (.createLinearGradient ctx 0 height 0 0))
(.addColorStop gradient 0 "#8ED6FF")
(.addColorStop gradient 1 "#FF8800")
(set! (.-font ctx) "16px Helvetica, Arial")
(set! (.-strokeStyle ctx) "#8A8A8A")

; All notes are referenced in steps from A4
(def C1 -21)
(def C2 -21)
(def C6 27)
(def C7 39)
(def C8 41)

(def lower-bound-note C2)
(def upper-bound-note C6)
(def steps (- upper-bound-note lower-bound-note))

(def flat "\u266D")
(def sharp "\u266F")
(def scale [ "A"
             (str "B" flat)
             "B"
             "C"
             (str "C" sharp)
             "D"
             (str "E" flat)
             "E"
             "F"
             (str "F" sharp)
             "G"
             (str "A" flat) ])

(def constraints (js-obj "video" false "audio" true))

(if (not js/navigator.getUserMedia)
  (.alert js/window "getUserMedia not supported"))

; Storage for things that get GCed unless you hang on to them.
(def refs (atom {}))

(defn draw-spectrum
  "Draw the spectrogram"
  [freq-mags]

  ; reset and start
  (set! (.-fillStyle ctx) gradient)
  (.beginPath ctx)
  (.moveTo ctx 0 spectrum-baseline)

  (let [lower-freq (u/freq-for-step lower-bound-note)
        upper-freq (u/freq-for-step upper-bound-note)
        freqs (:freqs @refs)
        arr-freqs (apply array freqs)
        lower-idx (.indexOf freqs (apply min-key #(Math/abs (- lower-freq %)) freqs))
        upper-idx (.indexOf freqs (apply min-key #(Math/abs (- upper-freq %)) freqs))
        partitioned-freqs (drop lower-idx (take (inc upper-idx) freq-mags))]
    (doall (map-indexed
             (fn [idx data]
               (let [note (u/steps-from-A4 (:freq data))
                     x (* (/ (- note lower-bound-note) steps) width)
                     y (- spectrum-baseline (* (/ (:mag data) 255) spectrum-baseline))]
                 (.lineTo ctx x y))) partitioned-freqs)))

  (.lineTo ctx width spectrum-baseline)
  (.fill ctx))

(defn print-scale
  "Print the scale accross the bottom"
  []

  (set! (.-strokeStyle ctx) "#8A8A8A")
  (.beginPath ctx)
  (.moveTo ctx 0 spectrum-baseline)
  (.lineTo ctx width spectrum-baseline)
  (.stroke ctx)

  (set! (.-fillStyle ctx) "#8A8A8A")
  (set! (.-textAlign ctx) "center")
  (set! (.-font ctx) "10px Helvetica, Arial")

  (let [semi-tones (range lower-bound-note upper-bound-note)
        octave #(+ 4 (Math/floor (/ % 12)))
        notes (map #(if (>= % 0)
                      (str (nth (cycle scale) %) (octave %))
                      (str (nth (cycle (reverse scale)) (Math/abs %)) (octave %)))
                   semi-tones)]
    (doall (map-indexed (fn [idx note]
                          (.fillText ctx note (* (/ idx steps) width) (- height 6)))
                        notes))
    ))

(defn draw-line-scale
  "Draw a line up every 4th note"
  []
  (set! (.-strokeStyle ctx) "#8A8A8A")
  (doall (map #(let [x (* (/ % 48) width)]
                  (.beginPath ctx)
                  (.moveTo ctx x 0)
                  (.lineTo ctx x spectrum-baseline)
                  (.stroke ctx))
              (drop 1 (take-nth 4 (range 0 steps)))))
  )

;(defn print-strongest-freq
;  "Print the strongest frequency in the top right corner of the graph"
;  [freq-data]
;  (let [highest-mag (apply max (take upper-idx simple-freq-data))
;        idx (.indexOf simple-freq-data highest-mag)
;        freq (u/freq-for-bin idx (:sample-rate @refs) (:fft-size @refs))]
;    (set! (.-fillStyle ctx) "#8A8A8A")
;    (.fillText ctx (str (js/parseInt freq 10) "Hz") (- width 70) 20)))

(defn clear
  "Clear the canvas"
  []
  (set! (.-fillStyle ctx) "black")
  (.fillRect ctx 0 0 width height))

(defn draw
  "Draw the spectrum"
  []
  (js/requestAnimationFrame draw)
  (let [analyser (:analyser @refs)
        uint8-freq-data (:freq-data @refs)]
    (.getByteFrequencyData analyser uint8-freq-data)
    (let [freq-data (u/to-non-typed-array uint8-freq-data)
          freq-mags (map-indexed
                      (fn [idx freq] {:freq freq :mag (nth freq-data idx) })
                      (:freqs @refs))]
      (clear)
      (draw-spectrum freq-mags)
      (draw-line-scale)
      (print-scale)
      ;(print-strongest-freq freq-data freq-mags)
      )))

(defn configure
  "User media stream callback"
  [stream]
  (let [context (js/AudioContext.)
        source (.createMediaStreamSource context stream)
        analyser (.createAnalyser context)]

    ; set the fft size
    (set! (.-fftSize analyser) 2048)
    (set! (.-minDecibels analyser) -85)
    (set! (.-maxDecibels analyser) -25)
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

    (swap! refs assoc :freqs
           (apply array
                  (map #(u/freq-for-bin % (:sample-rate @refs) (:fft-size @refs))
                       (range 0 (:freq-bin-count @refs)))))

    (js/requestAnimationFrame draw)))

(defn err-callback
  "Handle the error if stream creation failed"
  [err]
  (println err))

(.getUserMedia js/navigator constraints configure err-callback)
