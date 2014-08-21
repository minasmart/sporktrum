// Compiled by ClojureScript 0.0-2311
goog.provide('sporktrum.util');
goog.require('cljs.core');
/**
* Convert a typed array to an array
*/
sporktrum.util.to_non_typed_array = (function to_non_typed_array(typed_array){return Array.apply(cljs.core.PersistentVector.EMPTY,typed_array);
});
/**
* Get the corresponding frequency for a bin in the fft
*/
sporktrum.util.freq_for_bin = (function freq_for_bin(bin_index,sample_rate,fft_size){return (bin_index * (sample_rate / fft_size));
});
sporktrum.util.log_2 = Math.log.call(null,(2));
sporktrum.util.A4 = 440.0;
/**
* The number of dodecaphonic steps up or down from A @ 440 Hz
*/
sporktrum.util.steps_from_A4 = (function steps_from_A4(freq){return (((12) * Math.log.call(null,(freq / sporktrum.util.A4))) / sporktrum.util.log_2);
});
/**
* Frequency for the note `n` steps from A4
*/
sporktrum.util.freq_for_step = (function freq_for_step(steps){return (sporktrum.util.A4 * Math.pow.call(null,(2),(steps / (12))));
});
