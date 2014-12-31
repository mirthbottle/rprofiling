function reality_names(){
  return ['pa2', 'pa1', 'pb1', 'pb2'];
}

function profiled_names(){
  return ['pa2o', 'pa2r', 'pa1r', 'pa1o', 'pb1o', 'pb1r', 'pb2r', 'pb2o'];
}

function groupa_names(){
  return ['pa_1', 'pb_1', 'pa_1r', 'pb_1r'];
}

function initialize_presentation(){
  // populate default values of sliders and bars
  // % of population that is group a
  var pa = 10;
  document.getElementById('pa').value = pa.toFixed(1);
  // p(1|x) = % of group x that is group 1
  var p1_a = 5;
  document.getElementById('p1_a').value = p1_a.toFixed(1);
  var p1_b = 5;
  document.getElementById('p1_b').value = p1_b.toFixed(1);
  
  // p(r|x) = % of group x that is profiled
  var pr_a = 90;
  document.getElementById('pr_a').value = pr_a.toFixed(1);
  var pr_b = 60;
  document.getElementById('pr_b').value = pr_b.toFixed(1);
  
  var updated_data = compute_presentation_data(pa, p1_a, p1_b, pr_a, pr_b);
  
  // create bars
  var bars = {};
  // reality bar
  bars['reality'] = initialize_bar('#reality', updated_data['reality']);
  
  // profiled bar
  bars['profiled'] = initialize_bar('#profiled', updated_data['profiled']);

  // groupa bar
  bars['groupa'] = initialize_bar('#groupa', updated_data['groupa']);

  document.getElementById('e').innerHTML = updated_data['e'].toFixed(3);
  document.getElementById('u').innerHTML = updated_data['u'].toFixed(1);

  return bars;
}

function compute_presentation_data(pa, p1_a, p1_b, pr_a, pr_b){
  var all_data= {};
  var reality_values = compute_reality(pa, p1_a, p1_b); 
  all_data['reality'] = [reality_names(), reality_values, [reality_names()]];

  var profiled_values = compute_profiled(pa, p1_a, p1_b, pr_a, pr_b, reality_values);
  all_data['profiled'] = [profiled_names(), profiled_values, [profiled_names()]];

  var groupa_values = compute_groupa(reality_values, profiled_values); 
  var ga_names = groupa_names();
  all_data['groupa'] = [ga_names, groupa_values,
			[[ga_names[0], ga_names[1]], 
			 [ga_names[2], ga_names[3]]]];

  all_data['e'] = compute_efficiency(pa, pr_a, pr_b, profiled_values);
  all_data['u'] = compute_unfairness(groupa_values);

  return all_data;
}

function compute_reality(pa, p1_a, p1_b){
  
  // p(a && 1) = % of total that is subgroup a1
  var pa1 = p1_a/100.0*pa;
  var pa2 = pa - pa1;
  // % of total that is subgroup b1
  var pb1 = p1_b/100.0*(100-pa);
  var pb2 = 100 - pa - pb1;
  return [+pa2.toFixed(1), +pa1.toFixed(1), +pb1.toFixed(1), +pb2.toFixed(1)];
}

function compute_profiled(pa, p1_a, p1_b, pr_a, pr_b, reality_values){
  var pa2 = reality_values[0];
  var pa1 = reality_values[1];
  var pb1 = reality_values[2];
  var pb2 = reality_values[3];

  // p(r|x) = p(r| (x && 1)) = % of subgroup x1 that is profiled 
  // p(x && y && r) = % of total that is subgroup xy and profiled
  var pa1r = pa1*pr_a/100.0;
  // p(x && y && !r) = % of total that is subgroup xy and not profiled
  var pa1o = pa1 - pa1r;
  var pa2r = pa2*pr_a/100.0;
  var pa2o = pa2 - pa2r;

  var pb1r = pb1*pr_b/100.0;
  var pb1o = pb1 - pb1r;
  var pb2r = pb2*pr_b/100.0;
  var pb2o = pb2 - pb2r;

  return [+pa2o.toFixed(1), +pa2r.toFixed(1), +pa1r.toFixed(1), +pa1o.toFixed(1), +pb1o.toFixed(1), +pb1r.toFixed(1), +pb2r.toFixed(1), +pb2o.toFixed(1)];
}

function compute_groupa(reality_values, profiled_values){
  var pa1r = profiled_values[2];
  var pb1r = profiled_values[5];
  // p(a| (1 && r) = % of group 1 profiled that are group a
  var pa_1r = 100.0 * pa1r/(pa1r + pb1r);
  var pb_1r = 100.0 - pa_1r;

  var pa1 = reality_values[1];
  var pb1 = reality_values[2];
  // % of group 1 that are group a
  var pa_1 = 100.0 * pa1/(pa1 + pb1);
  var pb_1 = 100.0 - pa_1;
  return [+pa_1.toFixed(1), +pb_1.toFixed(1), +pa_1r.toFixed(1), +pb_1r.toFixed(1)];
}

function compute_efficiency(pa, pr_a, pr_b, profiled_values){
  var pa1r = profiled_values[2];
  var pb1r = profiled_values[5];
  // overall efficiency of profiler = % of x profiled that are group 1
  var e = 100.0 * (pa1r + pb1r)/(pa*pr_a + (100.0-pa)*pr_b);
  return +e.toFixed(1);
}

function compute_unfairness(groupa_values){
  var pa_1 = groupa_values[0];
  var pa_1r = groupa_values[2];
  // unfairness
  // % overrepresentation of group a among those profiled 
  var u = (pa_1r/pa_1 - 1.0)*100.0;
  return +u.toFixed(1);
 
}

function initialize_bar(chart_name, data){
  chart = c3.generate({
    bindto: chart_name,
    data: {
      rows: [data[0], 
	     data[1]],
      type: 'bar',
      order: null,
      groups: data[2]
    },
    axis: {
      rotated: true,
      x: { show: false },
      y: { show: false }
    }
  });
  return chart;
}



function update_presentation(bars) {
  // % of population that is group a
  var pa = document.getElementById('pa').value;
  // p(1|x) = % of group x that is group 1
  var p1_a = document.getElementById('p1_a').value;
  var p1_b = document.getElementById('p1_b').value;

  // p(r|x) = % of group x that is profiled
  var pr_a = document.getElementById('pr_a').value;
  var pr_b = document.getElementById('pr_b').value;

  var updated_data = compute_presentation_data(pa, p1_a, p1_b, pr_a, pr_b);

  update_bars(bars, updated_data);
  update_text(updated_data);
}

function update_bars(bars, updated_data){
  bars['reality'].load({
    rows: [updated_data['reality'][0], updated_data['reality'][1]],
    unload: [updated_data['reality'][0]]
  });
  
  bars['profiled'].load({
    rows: [updated_data['profiled'][0], updated_data['profiled'][1]],
    unload: [updated_data['profiled'][0]]
  });

  bars['groupa'].load({
    rows: [updated_data['groupa'][0], updated_data['groupa'][1]],
    unload: [updated_data['groupa'][0]]
  });
}


function update_text(updated_data){
  document.getElementById('e').innerHTML = updated_data['e'].toFixed(3);
  document.getElementById('u').innerHTML = updated_data['u'].toFixed(1);
}
