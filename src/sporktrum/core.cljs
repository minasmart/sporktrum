(ns sporktrum.core)

(enable-console-print!)

(def constraints (js-obj "video" false "audio" true))

(if (not js/navigator.getUserMedia)
  (.alert js/window "getUserMedia not supported"))

; Storage for things that get GCed unless you hang on to them.
(def handles (atom {}))

(defn process-audio
  "Process some audio! FINALLY!"
  [event]
  (let [native-frames (.getChannelData (.-inputBuffer event) 0)
        sample-rate (.-sampleRate (.-inputBuffer event))
        length (.-length native-frames)
        fft (js/FFT. length sample-rate)]
    (.forward fft native-frames)
    (let [f32-spectrum (.-spectrum fft)
          spectrum (.call (.-slice (.-prototype js/Array)) f32-spectrum)
          largest (apply max spectrum)
          index (.indexOf spectrum largest)
          length (count spectrum)
          freq (* index (/ sample-rate length))]
      (println (str "index: " index ", mag: " largest ", freq: " freq)))))

(defn stream-fn
  "User media stream callback"
  [stream]
  (let [context (js/AudioContext.)
        source (.createMediaStreamSource context stream)
        node (.createScriptProcessor context 4096 1 1)]

    ; Save a handle to the source
    (swap! handles assoc "source" source)
    ; listen to the audio data, and record into the buffer
    (set! (.-onaudioprocess node) process-audio)

    ; connect the ScriptProcessorNode with the input audio
    (.connect source node)
    ; if the ScriptProcessorNode is not connected to an output the
    ; "onaudioprocess" event is not triggered in chrome
    (.connect node (.-destination context))))


(defn err-callback
  "Handle the error if stream creation failed"
  [err]
  (println err))

(.getUserMedia js/navigator constraints stream-fn err-callback)
