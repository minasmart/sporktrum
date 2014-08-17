// Compiled by ClojureScript 0.0-2311
goog.provide('sporktrum.core');
goog.require('cljs.core');
cljs.core.enable_console_print_BANG_.call(null);
sporktrum.core.canvas_dom = document.getElementById("spectrum");
sporktrum.core.width = sporktrum.core.canvas_dom.width;
sporktrum.core.height = sporktrum.core.canvas_dom.height;
sporktrum.core.ctx = sporktrum.core.canvas_dom.getContext("2d");
sporktrum.core.gradient = sporktrum.core.ctx.createLinearGradient((0),sporktrum.core.height,(0),(0));
sporktrum.core.gradient.addColorStop((0),"#8ED6FF");
sporktrum.core.gradient.addColorStop((1),"#FF8800");
sporktrum.core.ctx.font = "16px Helvetica, Arial";
sporktrum.core.ctx.strokeStyle = "#8A8A8A";
sporktrum.core.constraints = (function (){var obj4973 = {"video":false,"audio":true};return obj4973;
})();
if(cljs.core.not.call(null,navigator.getUserMedia))
{window.alert("getUserMedia not supported");
} else
{}
sporktrum.core.refs = cljs.core.atom.call(null,cljs.core.PersistentArrayMap.EMPTY);
/**
* Convert a typed array to an array
*/
sporktrum.core.to_non_typed_array = (function to_non_typed_array(typed_array){return Array.apply(cljs.core.PersistentVector.EMPTY,typed_array);
});
/**
* Get the corresponding frequency for a bin in the fft
*/
sporktrum.core.freq_for_bin = (function freq_for_bin(bin_index){return (bin_index * (new cljs.core.Keyword(null,"sample-rate","sample-rate",-603246554).cljs$core$IFn$_invoke$arity$1(cljs.core.deref.call(null,sporktrum.core.refs)) / new cljs.core.Keyword(null,"fft-size","fft-size",773589460).cljs$core$IFn$_invoke$arity$1(cljs.core.deref.call(null,sporktrum.core.refs))));
});
/**
* Draw the spectrum
*/
sporktrum.core.draw = (function draw(){requestAnimationFrame(draw);
var analyser = new cljs.core.Keyword(null,"analyser","analyser",-110219096).cljs$core$IFn$_invoke$arity$1(cljs.core.deref.call(null,sporktrum.core.refs));var freq_data = new cljs.core.Keyword(null,"freq-data","freq-data",-977208748).cljs$core$IFn$_invoke$arity$1(cljs.core.deref.call(null,sporktrum.core.refs));var upper_idx = new cljs.core.Keyword(null,"upper-idx","upper-idx",1800228579).cljs$core$IFn$_invoke$arity$1(cljs.core.deref.call(null,sporktrum.core.refs));var line_x = ((new cljs.core.Keyword(null,"line-idx","line-idx",1836801388).cljs$core$IFn$_invoke$arity$1(cljs.core.deref.call(null,sporktrum.core.refs)) / upper_idx) * sporktrum.core.width);analyser.getByteFrequencyData(freq_data);
sporktrum.core.ctx.fillStyle = "black";
sporktrum.core.ctx.fillRect((0),(0),sporktrum.core.width,sporktrum.core.height);
sporktrum.core.ctx.beginPath();
sporktrum.core.ctx.moveTo(line_x,(0));
sporktrum.core.ctx.lineTo(line_x,sporktrum.core.height);
sporktrum.core.ctx.stroke();
sporktrum.core.ctx.fillStyle = sporktrum.core.gradient;
var simple_freq_data = sporktrum.core.to_non_typed_array.call(null,freq_data);var len = cljs.core.count.call(null,simple_freq_data);sporktrum.core.ctx.beginPath();
sporktrum.core.ctx.moveTo((0),sporktrum.core.height);
var n__4409__auto___4974 = upper_idx;var idx_4975 = (0);while(true){
if((idx_4975 < n__4409__auto___4974))
{var mag_4976 = cljs.core.get.call(null,simple_freq_data,idx_4975);var x_4977 = ((idx_4975 / upper_idx) * sporktrum.core.width);var y_4978 = (sporktrum.core.height - ((mag_4976 / (255)) * sporktrum.core.height));sporktrum.core.ctx.lineTo(x_4977,y_4978);
{
var G__4979 = (idx_4975 + (1));
idx_4975 = G__4979;
continue;
}
} else
{}
break;
}
sporktrum.core.ctx.lineTo(sporktrum.core.width,sporktrum.core.height);
sporktrum.core.ctx.fill();
var highest_mag = cljs.core.apply.call(null,cljs.core.max,cljs.core.take.call(null,upper_idx,simple_freq_data));var idx = simple_freq_data.indexOf(highest_mag);var freq = sporktrum.core.freq_for_bin.call(null,idx);sporktrum.core.ctx.fillStyle = "#8A8A8A";
return sporktrum.core.ctx.fillText((''+cljs.core.str.cljs$core$IFn$_invoke$arity$1(parseInt(freq,(10)))+"Hz"),(sporktrum.core.width - (70)),(20));
});
/**
* User media stream callback
*/
sporktrum.core.stream_fn = (function stream_fn(stream){var context = (new AudioContext());var source = context.createMediaStreamSource(stream);var analyser = context.createAnalyser();analyser.fftSize = (2048);
analyser.minDecibels = (-100);
analyser.maxDecibels = (-20);
analyser.smoothingTimeConstant = 0.9;
source.connect(analyser);
cljs.core.swap_BANG_.call(null,sporktrum.core.refs,cljs.core.assoc,new cljs.core.Keyword(null,"source","source",-433931539),source);
cljs.core.swap_BANG_.call(null,sporktrum.core.refs,cljs.core.assoc,new cljs.core.Keyword(null,"analyser","analyser",-110219096),analyser);
cljs.core.swap_BANG_.call(null,sporktrum.core.refs,cljs.core.assoc,new cljs.core.Keyword(null,"sample-rate","sample-rate",-603246554),context.sampleRate);
cljs.core.swap_BANG_.call(null,sporktrum.core.refs,cljs.core.assoc,new cljs.core.Keyword(null,"fft-size","fft-size",773589460),analyser.fftSize);
cljs.core.swap_BANG_.call(null,sporktrum.core.refs,cljs.core.assoc,new cljs.core.Keyword(null,"freq-bin-count","freq-bin-count",1095712575),analyser.frequencyBinCount);
cljs.core.swap_BANG_.call(null,sporktrum.core.refs,cljs.core.assoc,new cljs.core.Keyword(null,"freq-data","freq-data",-977208748),(new Uint8Array(new cljs.core.Keyword(null,"freq-bin-count","freq-bin-count",1095712575).cljs$core$IFn$_invoke$arity$1(cljs.core.deref.call(null,sporktrum.core.refs)))));
var freqs_4983 = cljs.core.map.call(null,((function (context,source,analyser){
return (function (p1__4980_SHARP_){return sporktrum.core.freq_for_bin.call(null,p1__4980_SHARP_);
});})(context,source,analyser))
,cljs.core.range.call(null,(0),new cljs.core.Keyword(null,"freq-bin-count","freq-bin-count",1095712575).cljs$core$IFn$_invoke$arity$1(cljs.core.deref.call(null,sporktrum.core.refs))));var arr_freqs_4984 = cljs.core.apply.call(null,cljs.core.array,freqs_4983);var closest_to_cap_4985 = cljs.core.apply.call(null,cljs.core.min_key,((function (freqs_4983,arr_freqs_4984,context,source,analyser){
return (function (p1__4981_SHARP_){return Math.abs.call(null,((5000) - p1__4981_SHARP_));
});})(freqs_4983,arr_freqs_4984,context,source,analyser))
,freqs_4983);var closest_to_voice_4986 = cljs.core.apply.call(null,cljs.core.min_key,((function (freqs_4983,arr_freqs_4984,closest_to_cap_4985,context,source,analyser){
return (function (p1__4982_SHARP_){return Math.abs.call(null,((200) - p1__4982_SHARP_));
});})(freqs_4983,arr_freqs_4984,closest_to_cap_4985,context,source,analyser))
,freqs_4983);cljs.core.swap_BANG_.call(null,sporktrum.core.refs,cljs.core.assoc,new cljs.core.Keyword(null,"upper-idx","upper-idx",1800228579),arr_freqs_4984.indexOf(closest_to_cap_4985));
cljs.core.swap_BANG_.call(null,sporktrum.core.refs,cljs.core.assoc,new cljs.core.Keyword(null,"line-idx","line-idx",1836801388),arr_freqs_4984.indexOf(closest_to_voice_4986));
return requestAnimationFrame(sporktrum.core.draw);
});
/**
* Handle the error if stream creation failed
*/
sporktrum.core.err_callback = (function err_callback(err){return cljs.core.println.call(null,err);
});
navigator.getUserMedia(sporktrum.core.constraints,sporktrum.core.stream_fn,sporktrum.core.err_callback);

//# sourceMappingURL=core.js.map