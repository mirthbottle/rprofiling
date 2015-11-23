// to modify the presentation for other issues, redefine variables
// at the end of your page 
// profiling.reality_names, profiling.profiled_names, profiling.groupa_names
// profiling.presentation_colors
// 
// a and b are the demographics of people, different races or different sexes
// 1 and 2 are whether the people really did something or not
// r is whether they were profiled

var profiling = {};

profiling.reality_names = ['pa2', 'pa1', 'pb1', 'pb2'];
profiling.profiled_names = ['pa2o', 'pa2r', 'pa1r', 'pa1o', 'pb1o', 'pb1r', 'pb2r', 'pb2o'];
profiling.reality1_names = ['pa_1', 'pb_1', 'pa_1r', 'pb_1r'];
profiling.outcome_names = ['pa_1r', 'pb_1r'];

profiling.presentation_colors = {'pa2':"#ffa900",
				 'pa2o':"#ffa900",
				 'pa2r':"#aa9900",
				 'pa1r':"#607100",
				 'pa_1r':"#607100",
				 'pa1':"#607100",
				 'pa_1':"#607100",
				 'pa1o':"#999900",
				 'pb2':"#6272bb",
				 'pb2o':"#6272bb",
				 'pb2r':"#e146ba",
				 'pb1r':"#c51b7d",
				 'pb_1r':"#c51b7d",
				 'pb1':"#c51b7d",
				 'pb_1':"#c51b7d",
				 'pb1o':"#20369e"
				};

function initialize_presentation(pa, p1_a, p1_b, pr_a, pr_b, p1_ra, p1_rb){
  // populate default values of sliders and bars
  // % of population that is group a
  document.getElementById('pa').value = (100*pa).toFixed();
  // p(1|x) = % of group x that is group 1
  document.getElementById('p1_a').value = (100*p1_a).toFixed();
  document.getElementById('p1_b').value = (100*p1_b).toFixed();
  
  // p(r|x) = % of group x that is profiled
  document.getElementById('pr_a').value = (100*pr_a).toFixed();
  document.getElementById('pr_b').value = (100*pr_b).toFixed();
  document.getElementById('p1_ra').value = (p1_ra).toFixed(2);
  document.getElementById('p1_rb').value = (p1_rb).toFixed(2);
  
  var updated_data = compute_presentation_data(pa, p1_a, p1_b, pr_a, pr_b, p1_ra, p1_rb);
  
  // create bars
  var bars = {};
  // reality bar
  bars['reality'] = initialize_bar('#reality', updated_data['reality']);
  
  // profiled bar
  bars['profiled'] = initialize_bar('#profiled', updated_data['profiled']);

  // reality1 bar
  bars['reality1'] = initialize_bar('#reality1', updated_data['reality1']);

  // groupa bar
  bars['outcome'] = initialize_bar('#outcome', updated_data['outcome']);

  update_text(updated_data);
  return bars;
}

function compute_presentation_data(pa, p1_a, p1_b, pr_a, pr_b, p1_ra, p1_rb){
  var all_data= {};
  var reality_values = compute_reality(pa, p1_a, p1_b); 
  all_data['reality'] = [profiling.reality_names, reality_values, 
			 [profiling.reality_names]];
   
  p1_ra = max_profile_skill(p1_a, pr_a, p1_ra);
  p1_rb = max_profile_skill(p1_b, pr_b, p1_rb);

  var profiled_values = compute_profiled(pa, p1_a, p1_b, pr_a, pr_b, 
					 p1_ra, p1_rb, reality_values);
 
  all_data['profiled'] = [profiling.profiled_names, profiled_values, [profiling.profiled_names]];

  all_data['profile_skill'] = compute_profile_skill(p1_ra, p1_rb, profiled_values);

  var reality1_values = compute_reality1(reality_values); 
  all_data['reality1'] = [profiling.reality1_names, reality1_values, [profiling.reality1_names]];

  var outcome_values = compute_outcome(profiled_values);
  all_data['outcome'] = [profiling.outcome_names, outcome_values, [profiling.outcome_names]];

  all_data['efficiency'] = compute_efficiency(profiled_values);
  all_data['effort'] = compute_effort(profiled_values);
  all_data['u'] = compute_unfairness(reality1_values, outcome_values);

  return all_data;
}

function compute_reality(pa, p1_a, p1_b){
  // p(a && 1) = % of total that is subgroup a1
  var pa1 = p1_a*pa;
  var pa2 = pa - pa1;
  // % of total that is subgroup b1
  var pb1 = p1_b*(1-pa);
  var pb2 = 1 - pa - pb1;
  return [+pa2.toFixed(3), +pa1.toFixed(3), +pb1.toFixed(3), +pb2.toFixed(3)];
}

function max_profile_skill(p1_x,  pr_x, p1_rx){
  p1_rx = Math.min(p1_rx, p1_x/pr_x);
  return +p1_rx.toFixed(3);
}

function compute_profiled(pa, p1_a, p1_b, pr_a, pr_b, p1_ra, p1_rb, reality_values){
  var pa2 = reality_values[0];
  var pa1 = reality_values[1];
  var pb1 = reality_values[2];
  var pb2 = reality_values[3];

  // p(r|x) = p(r| (x && 1)) = % of subgroup x1 that is profiled 
  // p(x && y && r) = % of total that is subgroup xy and profiled
  var pa1r = pa*pr_a*p1_ra;
  // p(x && y && !r) = % of total that is subgroup xy and not profiled
  var pa1o = pa1 - pa1r;
  var pa2r = pr_a*pa - pa1r;
  var pa2o = pa2 - pa2r;

  var pb1r = (1-pa)*pr_b*p1_rb;
  var pb1o = pb1 - pb1r;
  var pb2r = (1-pa)*pr_b -pb1r;
  var pb2o = pb2 - pb2r;

  return [+pa2o.toFixed(4), +pa2r.toFixed(4), +pa1r.toFixed(4), +pa1o.toFixed(4), +pb1o.toFixed(4), +pb1r.toFixed(4), +pb2r.toFixed(4), +pb2o.toFixed(4)];
}

function compute_outcome(profiled_values){
  var pa1r = profiled_values[2];
  var pb1r = profiled_values[5];
  // p(a| (1 && r) = % of group 1 profiled that are group a
  var pa_1r = pa1r/(pa1r + pb1r);
  var pb_1r = 1 - pa_1r;

  return [+pa_1r.toFixed(3), +pb_1r.toFixed(3)];
}

function compute_profile_skill(p1_ra, p1_rb, profiled_values){
  var pa2o = profiled_values[0];
  var pa1o = profiled_values[3];
  var pb1o = profiled_values[4];
  var pb2o = profiled_values[7];
  var p1_oa = pa1o/(pa1o + pa2o);
  var p1_ob = pb1o/(pb1o + pb2o);

  return [+p1_oa.toFixed(3), +p1_ob.toFixed(3), +p1_ra.toFixed(3), +p1_rb.toFixed(3)];
}


function compute_reality1(reality_values){
  var pa1 = reality_values[1];
  var pb1 = reality_values[2];
  // % of group 1 that are group a
  var pa_1 = pa1/(pa1 + pb1);
  var pb_1 = 1 - pa_1;
  return [+pa_1.toFixed(3), +pb_1.toFixed(3)];
}

function compute_efficiency(profiled_values){
  var pa2r = profiled_values[1];
  var pa1r = profiled_values[2];
  var pb1r = profiled_values[5];
  var pb2r = profiled_values[6];
  // overall efficiency of profiler = % of x profiled that are group 1
  var e = (pa1r + pb1r)/(pa1r + pa2r + pb1r + pb2r);
  return +e.toFixed(1);
}

function compute_effort(profiled_values){
  var pa1r = profiled_values[2];
  var pa2r = profiled_values[1];
  var pb1r = profiled_values[5];
  var pb2r = profiled_values[6];
  var e = pa1r + pa2r + pb1r + pb2r;
  return +e.toFixed(1);
}

function compute_unfairness(reality1_values, outcome_values){
  var pa_1 = reality1_values[0];
  var pa_1r = outcome_values[0];
  // unfairness
  // % overrepresentation of group a among those profiled 
  var u = (pa_1r/pa_1 - 1.0);
  return +u.toFixed(3);
 
}

function initialize_bar(chart_name, data){
  chart = c3.generate({
    bindto: chart_name,
    size: { height: 200 },
    bar: { width: { ratio: 1 }},
    padding: { bottom: 10 },
    data: {
      rows: [data[0], 
	     data[1]],
      type: 'bar',
      order: null,
      groups: data[2],
      colors: profiling.presentation_colors
    },
    axis: {
      rotated: true,
      x: { show: false },
      y: { show: true, 
	   tick: {format: d3.format('%,')},
	   padding: {
	     top: 0,
	     bottom: 0}
	 }
    },
    legend: { show: true },
    tooltip: {
      show: true,
      grouped: false,
      format: {	title: function (x) { return '';}}}     
  });
  return chart;
}



function update_presentation(bars) {
  // % of population that is group a
  var pa = document.getElementById('pa').value/100;
  // p(1|x) = % of group x that is group 1
  var p1_a = document.getElementById('p1_a').value/100;
  var p1_b = document.getElementById('p1_b').value/100;

  // p(r|x) = % of group x that is profiled
  var pr_a = document.getElementById('pr_a').value/100;
  var pr_b = document.getElementById('pr_b').value/100;
  var p1_ra = document.getElementById('p1_ra').value;
  var p1_rb = document.getElementById('p1_rb').value;

  var updated_data = compute_presentation_data(pa, p1_a, p1_b, pr_a, pr_b, p1_ra, p1_rb);

  update_bars(bars, updated_data);
  update_text(updated_data);
}

function update_bars(bars, updated_data){
  bars['reality'].load({
    rows: [updated_data['reality'][0], updated_data['reality'][1]],
    unload: [updated_data['reality'][0]]
  });
  
  bars['reality1'].load({
    rows: [updated_data['reality1'][0], updated_data['reality1'][1]],
    unload: [updated_data['reality1'][0]]
  });
  
  bars['profiled'].load({
    rows: [updated_data['profiled'][0], updated_data['profiled'][1]],
    unload: [updated_data['profiled'][0]]
  });
  
  bars['outcome'].load({
    rows: [updated_data['outcome'][0], updated_data['outcome'][1]],
    unload: [updated_data['outcome'][0]]
  });
}

function update_text(updated_data){
  var p1_oa = updated_data['profile_skill'][0];
  var p1_ob = updated_data['profile_skill'][1];
  var p1_ra = updated_data['profile_skill'][2];
  var p1_rb = updated_data['profile_skill'][3];
  document.getElementById('p1_ra').value = (p1_ra).toFixed(2);
  document.getElementById('p1_rb').value = (p1_rb).toFixed(2);
  document.getElementById('p1_oa').innerHTML = (p1_oa).toFixed(2);
  document.getElementById('p1_ob').innerHTML = (p1_ob).toFixed(2);
  document.getElementById('effort').innerHTML = (100*updated_data['effort']).toFixed();
  document.getElementById('efficiency').innerHTML = updated_data['efficiency'].toFixed(3);
  document.getElementById('u').innerHTML = (100*updated_data['u']).toFixed();
}

