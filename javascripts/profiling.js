function apply_filters() {
  // % of population that is group a
  var pa = document.getElementById('pa').value;
  // p(1|x) = % of group x that is group 1
  var p1_a = document.getElementById('p1_a').value;
  var p1_b = document.getElementById('p1_b').value;

  // p(r|x) = % of group x that is profiled
  var pr_a = document.getElementById('pr_a').value;
  var pr_b = document.getElementById('pr_b').value;

  // p(a && 1) = % of total that is subgroup a1
  var pa1 = p1_a/100.0*pa;
  var pa2 = pa - pa1;
  // % of total that is subgroup b1
  var pb1 = p1_b/100.0*(100-pa);
  var pb2 = 100 - pa - pb1;

  // p(r|x) = p(r| (x && 1)) = % of subgroup x1 that is profiled 
  // p(x && 1 && r) = % of total that is subgroup x1 and profiled
  var pa1r = pa1*pr_a/100.0;
  var pa2r = pa1 - pa1r;
  var pb1r = pb1*pr_b/100.0;
  var pb2f1 = pb1 - pb1r;
  
  // p(a| (1 && r) = % of group 1 profiled that are group a
  pa_1r = 100.0 * pa1r/(pa1r + pb1r);
  document.getElementById('pa_1r').innerHTML = pa_1r.toFixed(1);
  // % of group 1 that are group a
  pa_1 = 100.0 * pa1/(pa1 + pb1);
  document.getElementById('pa_1').innerHTML = pa_1.toFixed(1);

  // overall efficiency of profiler = % of x profiled that are group 1
  e = 100.0 * (pa1r + pb1r)/(pa*pr_a + pb*pr_b);
  document.getElementById('e').innerHTML = e.toFixed(1);

  // unfairness
  // % overrepresentation of group a among those profiled 
  ua_1r = (pa_1r/pa_1 - 1)*100;
  document.getElementById('ua_1r').innerHTML = ua_1r.toFixed(1);

  update_bars(pa1, pa2, pb1, pb2, pa1f1, pa2f1, pb1f1, pb2f1, pa_1f1, pa_1);
}

function initialize_presentation(){
  // populate default values of sliders and bars
  // % of population that is group a
  var pa = 10;
  document.getElementById('pa').innerHTML = pa.toFixed(1);
  // p(1|x) = % of group x that is group 1
  var p1_a = 5;
  document.getElementById('p1_a').innerHTML = p1_a.toFixed(1);
  var p1_b = 5;
  document.getElementById('p1_b').innerHTML = p1_b.toFixed(1);

  // p(r|x) = % of group x that is profiled
  var pr_a = 90;
  document.getElementById('pr_a').innerHTML = pr_a.toFixed(1);
  var pr_b = 60;
  document.getElementById('pr_b').innerHTML = pr_b.toFixed(1);

  // prepare data for bars
  // reality bar
  var reality_data = [];

  // profiled bar
  var profiled_data = [];
  
  // groupa_profiled bar

  // groupa bar
}

function update_bars(pa1, pa2, pb1, pb2, pa1r, pa2r, pb1r, pb2r, pa_1r, pa_1){
  
  
}
