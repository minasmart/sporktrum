(ns sporktrum.util)

(defn to-non-typed-array
  "Convert a typed array to an array"
  [typed-array]
  (.apply js/Array [] typed-array))

(defn freq-for-bin
  "Get the corresponding frequency for a bin in the fft"
  [bin-index sample-rate fft-size]
  (* bin-index (/ sample-rate fft-size)))

(def ^{:private true} log-2 (Math/log 2))
(def ^{:private true} A4 440.0)

(defn steps-from-A4
  "The number of dodecaphonic steps up or down from A @ 440 Hz"
  [freq]
  (/ (* 12 (Math/log (/ freq A4))) log-2))

(defn freq-for-step
  "Frequency for the note `n` steps from A4"
  [steps]
  (* A4 (Math/pow 2 (/ steps 12))))
