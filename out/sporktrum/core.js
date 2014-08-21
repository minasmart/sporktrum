// Compiled by ClojureScript 0.0-2311
goog.provide('sporktrum.core');
goog.require('cljs.core');
goog.require('sporktrum.util');
goog.require('sporktrum.util');
cljs.core.enable_console_print_BANG_.call(null);
sporktrum.core.canvas_dom = document.getElementById("spectrum");
sporktrum.core.width = sporktrum.core.canvas_dom.width;
sporktrum.core.height = sporktrum.core.canvas_dom.height;
sporktrum.core.spectrum_baseline = (sporktrum.core.height - (20));
sporktrum.core.ctx = sporktrum.core.canvas_dom.getContext("2d");
sporktrum.core.gradient = sporktrum.core.ctx.createLinearGradient((0),sporktrum.core.height,(0),(0));
sporktrum.core.gradient.addColorStop((0),"#8ED6FF");
sporktrum.core.gradient.addColorStop((1),"#FF8800");
sporktrum.core.ctx.font = "16px Helvetica, Arial";
sporktrum.core.ctx.strokeStyle = "#8A8A8A";
sporktrum.core.C1 = (-21);
sporktrum.core.C2 = (-21);
sporktrum.core.C6 = (27);
sporktrum.core.C7 = (39);
sporktrum.core.C8 = (41);
sporktrum.core.lower_bound_note = sporktrum.core.C2;
sporktrum.core.upper_bound_note = sporktrum.core.C6;
sporktrum.core.steps = (sporktrum.core.upper_bound_note - sporktrum.core.lower_bound_note);
sporktrum.core.flat = "\u266D";
sporktrum.core.sharp = "\u266F";
sporktrum.core.scale = new cljs.core.PersistentVector(null, 12, 5, cljs.core.PersistentVector.EMPTY_NODE, ["A",("B"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(sporktrum.core.flat)),"B","C",("C"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(sporktrum.core.sharp)),"D",("E"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(sporktrum.core.flat)),"E","F",("F"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(sporktrum.core.sharp)),"G",("A"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(sporktrum.core.flat))], null);
sporktrum.core.constraints = (function (){var obj4973 = {"video":false,"audio":true};return obj4973;
})();
if(cljs.core.not.call(null,navigator.getUserMedia))
{window.alert("getUserMedia not supported");
} else
{}
sporktrum.core.refs = cljs.core.atom.call(null,cljs.core.PersistentArrayMap.EMPTY);
/**
* Draw the spectrogram
*/
sporktrum.core.draw_spectrum = (function draw_spectrum(freq_mags){sporktrum.core.ctx.fillStyle = sporktrum.core.gradient;
sporktrum.core.ctx.beginPath();
sporktrum.core.ctx.moveTo((0),sporktrum.core.spectrum_baseline);
var lower_freq_4976 = sporktrum.util.freq_for_step.call(null,sporktrum.core.lower_bound_note);var upper_freq_4977 = sporktrum.util.freq_for_step.call(null,sporktrum.core.upper_bound_note);var freqs_4978 = new cljs.core.Keyword(null,"freqs","freqs",1215470702).cljs$core$IFn$_invoke$arity$1(cljs.core.deref.call(null,sporktrum.core.refs));var arr_freqs_4979 = cljs.core.apply.call(null,cljs.core.array,freqs_4978);var lower_idx_4980 = freqs_4978.indexOf(cljs.core.apply.call(null,cljs.core.min_key,((function (lower_freq_4976,upper_freq_4977,freqs_4978,arr_freqs_4979){
return (function (p1__4974_SHARP_){return Math.abs.call(null,(lower_freq_4976 - p1__4974_SHARP_));
});})(lower_freq_4976,upper_freq_4977,freqs_4978,arr_freqs_4979))
,freqs_4978));var upper_idx_4981 = freqs_4978.indexOf(cljs.core.apply.call(null,cljs.core.min_key,((function (lower_freq_4976,upper_freq_4977,freqs_4978,arr_freqs_4979,lower_idx_4980){
return (function (p1__4975_SHARP_){return Math.abs.call(null,(upper_freq_4977 - p1__4975_SHARP_));
});})(lower_freq_4976,upper_freq_4977,freqs_4978,arr_freqs_4979,lower_idx_4980))
,freqs_4978));var partitioned_freqs_4982 = cljs.core.drop.call(null,lower_idx_4980,cljs.core.take.call(null,(upper_idx_4981 + (1)),freq_mags));cljs.core.doall.call(null,cljs.core.map_indexed.call(null,((function (lower_freq_4976,upper_freq_4977,freqs_4978,arr_freqs_4979,lower_idx_4980,upper_idx_4981,partitioned_freqs_4982){
return (function (idx,data){var note = sporktrum.util.steps_from_A4.call(null,new cljs.core.Keyword(null,"freq","freq",-1855845278).cljs$core$IFn$_invoke$arity$1(data));var x = (((note - sporktrum.core.lower_bound_note) / sporktrum.core.steps) * sporktrum.core.width);var y = (sporktrum.core.spectrum_baseline - ((new cljs.core.Keyword(null,"mag","mag",48619174).cljs$core$IFn$_invoke$arity$1(data) / (255)) * sporktrum.core.spectrum_baseline));return sporktrum.core.ctx.lineTo(x,y);
});})(lower_freq_4976,upper_freq_4977,freqs_4978,arr_freqs_4979,lower_idx_4980,upper_idx_4981,partitioned_freqs_4982))
,partitioned_freqs_4982));
sporktrum.core.ctx.lineTo(sporktrum.core.width,sporktrum.core.spectrum_baseline);
return sporktrum.core.ctx.fill();
});
/**
* Print the scale accross the bottom
*/
sporktrum.core.print_scale = (function print_scale(){sporktrum.core.ctx.strokeStyle = "#8A8A8A";
sporktrum.core.ctx.beginPath();
sporktrum.core.ctx.moveTo((0),sporktrum.core.spectrum_baseline);
sporktrum.core.ctx.lineTo(sporktrum.core.width,sporktrum.core.spectrum_baseline);
sporktrum.core.ctx.stroke();
sporktrum.core.ctx.fillStyle = "#8A8A8A";
sporktrum.core.ctx.textAlign = "center";
sporktrum.core.ctx.font = "10px Helvetica, Arial";
var semi_tones = cljs.core.range.call(null,sporktrum.core.lower_bound_note,sporktrum.core.upper_bound_note);var octave = ((function (semi_tones){
return (function (p1__4983_SHARP_){return ((4) + Math.floor.call(null,(p1__4983_SHARP_ / (12))));
});})(semi_tones))
;var notes = cljs.core.map.call(null,((function (semi_tones,octave){
return (function (p1__4984_SHARP_){if((p1__4984_SHARP_ >= (0)))
{return (''+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.nth.call(null,cljs.core.cycle.call(null,sporktrum.core.scale),p1__4984_SHARP_))+cljs.core.str.cljs$core$IFn$_invoke$arity$1(octave.call(null,p1__4984_SHARP_)));
} else
{return (''+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.nth.call(null,cljs.core.cycle.call(null,cljs.core.reverse.call(null,sporktrum.core.scale)),Math.abs.call(null,p1__4984_SHARP_)))+cljs.core.str.cljs$core$IFn$_invoke$arity$1(octave.call(null,p1__4984_SHARP_)));
}
});})(semi_tones,octave))
,semi_tones);return cljs.core.doall.call(null,cljs.core.map_indexed.call(null,((function (semi_tones,octave,notes){
return (function (idx,note){return sporktrum.core.ctx.fillText(note,((idx / sporktrum.core.steps) * sporktrum.core.width),(sporktrum.core.height - (6)));
});})(semi_tones,octave,notes))
,notes));
});
/**
* Draw a line up every 4th note
*/
sporktrum.core.draw_line_scale = (function draw_line_scale(){sporktrum.core.ctx.strokeStyle = "#8A8A8A";
return cljs.core.doall.call(null,cljs.core.map.call(null,(function (p1__4985_SHARP_){var x = ((p1__4985_SHARP_ / (48)) * sporktrum.core.width);sporktrum.core.ctx.beginPath();
sporktrum.core.ctx.moveTo(x,(0));
sporktrum.core.ctx.lineTo(x,sporktrum.core.spectrum_baseline);
return sporktrum.core.ctx.stroke();
}),cljs.core.drop.call(null,(1),cljs.core.take_nth.call(null,(4),cljs.core.range.call(null,(0),sporktrum.core.steps)))));
});
/**
* Clear the canvas
*/
sporktrum.core.clear = (function clear(){sporktrum.core.ctx.fillStyle = "black";
return sporktrum.core.ctx.fillRect((0),(0),sporktrum.core.width,sporktrum.core.height);
});
/**
* Draw the spectrum
*/
sporktrum.core.draw = (function draw(){requestAnimationFrame(draw);
var analyser = new cljs.core.Keyword(null,"analyser","analyser",-110219096).cljs$core$IFn$_invoke$arity$1(cljs.core.deref.call(null,sporktrum.core.refs));var uint8_freq_data = new cljs.core.Keyword(null,"freq-data","freq-data",-977208748).cljs$core$IFn$_invoke$arity$1(cljs.core.deref.call(null,sporktrum.core.refs));analyser.getByteFrequencyData(uint8_freq_data);
var freq_data = sporktrum.util.to_non_typed_array.call(null,uint8_freq_data);var freq_mags = cljs.core.map_indexed.call(null,((function (freq_data,analyser,uint8_freq_data){
return (function (idx,freq){return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"freq","freq",-1855845278),freq,new cljs.core.Keyword(null,"mag","mag",48619174),cljs.core.nth.call(null,freq_data,idx)], null);
});})(freq_data,analyser,uint8_freq_data))
,new cljs.core.Keyword(null,"freqs","freqs",1215470702).cljs$core$IFn$_invoke$arity$1(cljs.core.deref.call(null,sporktrum.core.refs)));sporktrum.core.clear.call(null);
sporktrum.core.draw_spectrum.call(null,freq_mags);
sporktrum.core.draw_line_scale.call(null);
return sporktrum.core.print_scale.call(null);
});
/**
* User media stream callback
*/
sporktrum.core.configure = (function configure(stream){var context = (new AudioContext());var source = context.createMediaStreamSource(stream);var analyser = context.createAnalyser();analyser.fftSize = (2048);
analyser.minDecibels = (-85);
analyser.maxDecibels = (-25);
analyser.smoothingTimeConstant = 0.9;
source.connect(analyser);
cljs.core.swap_BANG_.call(null,sporktrum.core.refs,cljs.core.assoc,new cljs.core.Keyword(null,"source","source",-433931539),source);
cljs.core.swap_BANG_.call(null,sporktrum.core.refs,cljs.core.assoc,new cljs.core.Keyword(null,"analyser","analyser",-110219096),analyser);
cljs.core.swap_BANG_.call(null,sporktrum.core.refs,cljs.core.assoc,new cljs.core.Keyword(null,"sample-rate","sample-rate",-603246554),context.sampleRate);
cljs.core.swap_BANG_.call(null,sporktrum.core.refs,cljs.core.assoc,new cljs.core.Keyword(null,"fft-size","fft-size",773589460),analyser.fftSize);
cljs.core.swap_BANG_.call(null,sporktrum.core.refs,cljs.core.assoc,new cljs.core.Keyword(null,"freq-bin-count","freq-bin-count",1095712575),analyser.frequencyBinCount);
cljs.core.swap_BANG_.call(null,sporktrum.core.refs,cljs.core.assoc,new cljs.core.Keyword(null,"freq-data","freq-data",-977208748),(new Uint8Array(new cljs.core.Keyword(null,"freq-bin-count","freq-bin-count",1095712575).cljs$core$IFn$_invoke$arity$1(cljs.core.deref.call(null,sporktrum.core.refs)))));
cljs.core.swap_BANG_.call(null,sporktrum.core.refs,cljs.core.assoc,new cljs.core.Keyword(null,"freqs","freqs",1215470702),cljs.core.apply.call(null,cljs.core.array,cljs.core.map.call(null,((function (context,source,analyser){
return (function (p1__4986_SHARP_){return sporktrum.util.freq_for_bin.call(null,p1__4986_SHARP_,new cljs.core.Keyword(null,"sample-rate","sample-rate",-603246554).cljs$core$IFn$_invoke$arity$1(cljs.core.deref.call(null,sporktrum.core.refs)),new cljs.core.Keyword(null,"fft-size","fft-size",773589460).cljs$core$IFn$_invoke$arity$1(cljs.core.deref.call(null,sporktrum.core.refs)));
});})(context,source,analyser))
,cljs.core.range.call(null,(0),new cljs.core.Keyword(null,"freq-bin-count","freq-bin-count",1095712575).cljs$core$IFn$_invoke$arity$1(cljs.core.deref.call(null,sporktrum.core.refs))))));
return requestAnimationFrame(sporktrum.core.draw);
});
/**
* Handle the error if stream creation failed
*/
sporktrum.core.err_callback = (function err_callback(err){return cljs.core.println.call(null,err);
});
navigator.getUserMedia(sporktrum.core.constraints,sporktrum.core.configure,sporktrum.core.err_callback);
