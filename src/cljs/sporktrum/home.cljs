(ns sporktrum.home
  (:require [reagent.core :as reagent :refer [atom]]
            [reagent.session :as session]
            [squelch.audio-context :as ac]
            [squelch.audio-node :as node]
            [squelch.audio-param :as param]
            [squelch.nodes.oscillator :as osc]
            [squelch.nodes.gain :as g]))





; Scale and note definitions
(def notes [ :A :Bb :B :C :Db :D :Eb :E :F :Gb :G :Ab ])
(def octaves (range 2 7))
(def A4 440.0)





; Scale calculations
(defn freq-for-step
  "Frequency for the note `n` steps from A4"
  [steps]
  (* A4 (Math/pow 2 (/ steps 12))))

(defn steps-from-A4
  [octave note]
  (let [arr-notes (to-array notes)
        root-octave 4
        notes-in-scale (.-length arr-notes)
        octaves-from-root (- octave 4)
        offset-from-A (.indexOf arr-notes note)]
    (+ (* octaves-from-root notes-in-scale) offset-from-A)))





; Interactive functions
(defn play-freq
  [freq]
  "Play a frequency"
  (let [ctx (session/get :ctx)
        destination (ac/get-destination ctx)
        oscillator (ac/create-oscillator ctx)]

    (param/set-value (osc/get-frequency oscillator) freq)
    (node/connect oscillator destination)
    (session/put! :osc oscillator)
    (osc/start oscillator)))

(defn stop-note
  []
  "Stop the current osc."
  (let [oscillator (session/get :osc)]
    (osc/stop oscillator)
    (node/disconnect oscillator)
    ))





; Rendering
(defn button-for-note
  [octave note]
  (let [step (steps-from-A4 octave note)
        freq (freq-for-step step)
        label (str (name note) octave)]
  [:button {:on-mouse-down #(play-freq freq)
            :on-mouse-up #(stop-note)}
   label]))

(defn main []
  (let [audio-ctx (ac/new-audio-context)]
    (session/put! :ctx audio-ctx)
    [:div [:h2 "notes"]
     (map (fn [octave]
            [:div (map (fn
                         [note]
                         (button-for-note octave note))
                       notes)])
          octaves)
     [:h2 "visualization"]]
    ))
