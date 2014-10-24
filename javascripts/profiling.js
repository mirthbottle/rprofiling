function conduct_search() {
  var b_shoppers = document.getElementById('b_shoppers').value;
  var b_shoplifters = document.getElementById('b_shoplifters').value;
  var w_shoplifters = document.getElementById('w_shoplifters').value;
  var b_caught = document.getElementById('b_caught').value;
  var w_caught = document.getElementById('w_caught').value;

  var b_s = b_shoplifters/100.0*b_shoppers;
  var b_i = b_shoppers - b_s;
  var w_s = w_shoplifters/100.0*(100-b_shoppers);
  var w_i = 100 - b_shoppers - w_s;
  var b_c = b_s*b_caught/100.0;
  var b_ga = b_s - b_c;
  var w_c = w_s*w_caught/100.0;
  var w_ga = w_s - w_c;

  caught_bw = 100.0 * b_c/(b_c + w_c);
  document.getElementById('caught_bw_ratio').innerHTML = caught_bw.toFixed(1);
  shoplifters_bw = 100.0 * b_s/(b_s + w_s);
  document.getElementById('shoplifters_bw_ratio').innerHTML = shoplifters_bw.toFixed(1);

  caught_error = (caught_bw/shoplifters_bw - 1)*100;
  document.getElementById('caught_error').innerHTML = caught_error.toFixed(1);
  display_shoppers(b_i, b_s, w_i,w_s, b_c, b_ga, w_c, w_ga, caught_bw, shoplifters_bw);
}

function display_search_results(b_i, b_s, w_i, w_s, b_c, b_ga, w_c, w_ga, c_r, g_r){
  // c_r = caught ratio
  // g_r = guilty ratio
  var scale = 5;
  document.getElementById('b_ishoppers_bar').style.cssText="width:" + b_i*scale + "px;background-color: orange;";
  document.getElementById('b_shoplifters_bar').style.cssText="width:" + b_s*scale + "px;background-color: orangered;";
  document.getElementById('w_ishoppers_bar').style.cssText="width:" + w_i*scale + "px;background-color: yellowgreen;";
  document.getElementById('w_shoplifters_bar').style.cssText="width:" + w_s*scale + "px;background-color: olivedrab;";


  document.getElementById('b_innocent').style.cssText="width:" + b_i*scale + "px;background-color: orange;";
  document.getElementById('b_got_away').style.cssText="width:" + b_ga*scale + "px;background-color: orangered;";
  document.getElementById('b_caught_bar').style.cssText="width:" + b_c*scale + "px;background-color: red;";
  document.getElementById('w_innocent').style.cssText="width:" + w_i*scale + "px;background-color: yellowgreen;";
  document.getElementById('w_got_away').style.cssText="width:" + w_ga*scale + "px;background-color: olivedrab;";
  document.getElementById('w_caught_bar').style.cssText="width:" + w_c*scale + "px;background-color: darkolivegreen;";

  document.getElementById('b_caught_races').style.cssText="width:" + c_r*scale + "px;background-color: red;";
  document.getElementById('w_caught_races').style.cssText="font-size:20px;width:" + (100-c_r)*scale + "px;background-color: darkolivegreen;";
  document.getElementById('b_guilty').style.cssText="width:" + g_r*scale + "px;background-color: orangered;";
  document.getElementById('w_guilty').style.cssText="font-size:20px;width:" + (100-g_r)*scale + "px;background-color: olivedrab;";
}

