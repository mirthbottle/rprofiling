function apply_filters() {
  // % of population that is group a
  var pa = document.getElementById('pa').value;
  // p(1|a) = % of group a that is group 1
  var p1_a = document.getElementById('p1_a').value;
  // p(1|b) = % of group b that is group 1
  var p1_b = document.getElementById('p1_b').value;
  // p(f1| (a && 1)) = % of subgroup a1 captured by filter1
  var pf1_a1 = document.getElementById('pf1_a1').value;
  // p(f1| (b && 1)) = % of subgroup b1 captured by filter1
  var pf1_b1 = document.getElementById('pf1_b1').value;
  
  // p(a && 1) = % of total that is subgroup a1
  var pa1 = p1_a/100.0*pa;
  var pa2 = pa - pa1;
  // % of total that is subgroup b1
  var pb1 = p1_b/100.0*(100-pa);
  var pb2 = 100 - pa - pb1;
  // p(a && 1 && f1) = % of total that is subgroup a1 and captured by filter1
  var pa1f1 = pa1*pf1_a1/100.0;
  var pa2f1 = pa1 - pa1f1;
  // % of total that is subgroup b1 and captured by filter1
  var pb1f1 = pb1*pf1_b1/100.0;
  var pb2f1 = pb1 - pb1f1;
  
  // p(a| (1 && f1) = % of group 1 captured by filter1 that are group a
  pa_1f1 = 100.0 * pa1f1/(pa1f1 + pb1f1);
  document.getElementById('pa_1f1').innerHTML = pa_1f1.toFixed(1);
  // % of group 1 that are group a
  pa_1 = 100.0 * pa1/(pa1 + pb1);
  document.getElementById('pa_1').innerHTML = pa_1.toFixed(1);
  
  // % overrepresentation of ga among sg1 captured by filter1 
  ea_1f1 = (pa_1f1/pa_1 - 1)*100;
  document.getElementById('ea_1f1').innerHTML = ea_1f1.toFixed(1);
  display_shoppers(pa1, pa2, pb1, pb2, pa1f1, pa2f1, pb1f1, pb2f1, pa_1f1, pa_1);
}

function display_bars(pa1, pa2, pb1, pb2, pa1f1, pa2f1, pb1f1, pb2f1, pa_1f1, pa_1){
  
  
}
