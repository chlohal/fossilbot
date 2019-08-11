
Array.prototype.findSName = function(y) {

return this.find(x => { return x.name == y })

}
		
		var playerDats = {};
function formatLb(d,sFunc,dOR) {
var nE = true;
var ol = document.getElementById('list');

if(!dOR) { ol.innerHTML = '' }

d = d.sort(sFunc);

var GSBNhex = ['#FFD700','#C0C0C0','#CD7F32','#3E4246'];
for(var i = 0; i < d.length; i++) {
try {
var bE = document.createElement('li');

var kll = d[i].r.stats.find(x => { return x.name == 'total_kills'}).value,
    dth = d[i].r.stats.find(x => { return x.name == 'total_deaths'}).value,
    exp = d[i].r.stats.find(x => { return x.name == 'total_contribution_score'}).value;

bE.innerHTML = '<img src="https://cdn.discordapp.com/avatars/' + d[i].discord.id + '/' + d[i].discord.avatar + '" alt="'+ d[i].discord.username +' " style="border: 2px solid ' + GSBNhex[Math.min(3,i)] +'"> <span>' + d[i].discord.username +'<b>#'+d[i].discord.discriminator +'</b></span> <div class="listatdiv"> <span>Rank ' + (i + 1) +'</span> | <span class="data1">K/D ' + ((kll / dth ).toString().substring(0,4)) +'</span> | <span class="data2">' + exp + 'XP</span></div><div class="advancedData" onclick="event.stopPropagation();" style="display:none"><hr><div class=dataHolder></div><div class="advLoadImgH"><img src="/load.svg" alt="Loading..." class="advLoadImg"></div></div>'

bE.setAttribute('data-discord-id',d[i].discord.id);
bE.addEventListener('click', function(e) { 
advInfoOpen(e);
});
ol.appendChild(bE);
} catch(e) {if(e) { nE = false } }
}
return nE
}

function formatAdvData (x,y) {

var putIn = y.querySelector(".dataHolder");
var ec = '';
var csWeaponIdToNameArray = ['','Desert Eagle','Dual Berettas','Five-SeveN','Glock-18','AK-47','AUG','AWP','FAMAS','G3SG1','Galil AR','M249','M4A4','MAC-10','MP5-SD','UMP-45','XM1014','PP-Bizon','MAG-7','Negev','Sawed-Off','Tec-9','Zeus x27','P2000','MP7','MP9','Nova','P250','SCAR-20','SG 553','SSG 08','Knife','Knife','Flashbang','H-Ex Grenade', 'Smoke Grenade', 'Molotov','Decoy Grenade','Incendiary Grenade', 'C4','Kevlar Vest','Kevlar Vest + Helmet','Heavy Assualt Suit','item_nvg','Defuse Kit','Rescue Kit','Medi-Shot','Music Kit','Knife','M4-A1-S','USP-S','Trade Up Contract','CZ75-Auto','R8 Revolver','Tactical Awareness Grenade','Bayonet','Flip Knife','Gut Knife','Karambit','M9 Bayonet','Huntsman Knife','Falchion Knife','Bowie Knife','Butterfly Knife','Shadow Daggers','Ursus Knife','Navaja Knife','Stiletto Knife','Talon Knife'];

function sdd(a,m) {
if(!a) return
var e = {name: a.name, value: a.value};
if(m) e.name = m
return '<div class="dataDefinitionHolder"><div class="dataName">'+e.name.replace(/_/g,' ').toUpperCase()+'</div><div class="dataData">' + e.value + '</div></div>\n'
}

ec += '<span class="dataSectionName">General Stats</span><div class="dataDefinitionSection">'
ec += sdd(x.findSName('total_contribution_score'))
ec += sdd(x.findSName('total_kills'))
ec += sdd(x.findSName('total_deaths'))
ec += '<div class="dataDefinitionHolder"><div class="dataName">K/D</div><div class="dataData">' + (x.findSName('total_kills').value / x.findSName('total_deaths').value).toString().substring(0,6) + '</div></div>\n'
ec += '<div class="dataDefinitionHolder"><div class="dataName">ACCURACY</div><div class="dataData">' + (x.findSName('total_shots_hit').value / x.findSName('total_shots_fired').value).toString().substring(0,4) + '</div></div>\n'
ec += sdd(x.findSName('total_wins'))
ec += sdd(x.findSName('total_damage_done'))
ec += sdd(x.findSName('total_kills_headshot'),'headshots')
ec += sdd(x.findSName('total_money_earned'))
ec += sdd(x.findSName('total_planted_bombs'))
ec += sdd(x.findSName('total_defused_bombs'))
ec += sdd(x.findSName('total_wins_pistolround'),'total_wins_(pistol round)')
ec += sdd(x.findSName('total_weapons_donated'))
ec += sdd(x.findSName('total_broken_windows'))
ec += sdd(x.findSName('total_mvps'))
ec += sdd(x.findSName('total_kills_enemy_blinded'),'total_kills_(enemy_blinded)')
ec += sdd(x.findSName('total_kills_knife_fight'),'total_kills_in_a_knife_fight')
ec += sdd(x.findSName('total_kills_against_zoomed_sniper'))
ec += sdd(x.findSName('total_dominations'))
ec += sdd(x.findSName('total_domination_overkills'))
ec += sdd(x.findSName('total_revenges'))
ec += sdd(x.findSName('total_shots_fired'))
ec += sdd(x.findSName('total_shots_hit'))
ec += sdd(x.findSName('total_matches_played'))
ec += sdd(x.findSName('total_matches_won'))
ec += sdd(x.findSName('total_rounds_played'))
ec += '</div>'

ec += '<span class="dataSectionName">Last Match Stats</span><div class="dataDefinitionSection">'
ec += sdd(x.findSName('last_match_t_wins'),'t_rounds_won')
ec += sdd(x.findSName('last_match_ct_wins'),'ct_rounds_won')
ec += sdd(x.findSName('last_match_wins'),'rounds_won')
ec += sdd(x.findSName('last_match_kills'),'kills')
ec += sdd(x.findSName('last_match_deaths'),'deaths')
ec += '<div class="dataDefinitionHolder"><div class="dataName">K/D</div><div class="dataData">' + (x.findSName('last_match_kills').value / x.findSName('last_match_deaths').value).toString().substring(0,6) + '</div></div>\n'
ec += sdd(x.findSName('last_match_mvps'),'mvps')
ec += sdd(x.findSName('last_match_damage'),'damage')
ec += '<div class="dataDefinitionHolder"><div class="dataName">FAVORITE WEAPON</div><div class="dataData">' + csWeaponIdToNameArray[x.findSName('last_match_favweapon_id').value] + '</div></div>\n'
ec += '<div class="dataDefinitionHolder"><div class="dataName">FAVORITE WEAPON ACCURACY</div><div class="dataData">' + (x.findSName('last_match_favweapon_hits').value / x.findSName('last_match_favweapon_shots').value).toString().substring(0,6) + '</div></div>\n'
ec += sdd(x.findSName('last_match_favweapon_shots'),'favorite_weapon_shots')
ec += sdd(x.findSName('last_match_favweapon_hits'),'favorite_weapon_hits')
ec += sdd(x.findSName('last_match_favweapon_kills'),'favorite_weapon_kills')
ec += sdd(x.findSName('last_match_contribution_score'),'contribution_score')
ec += sdd(x.findSName('last_match_rounds'),'rounds')
ec += sdd(x.findSName('last_match_money_spent'),'money_spent')
ec += sdd(x.findSName('last_match_dominations'),'dominations')
ec += sdd(x.findSName('last_match_revenges'),'revenges')
ec += '</div>'

console.log();

y.querySelector('.advLoadImgH').style.display = 'none'
putIn.innerHTML = ec


}

function advInfoOpen(e) {

if(e.target.querySelector('.advancedData').style.display == 'block') {
e.target.querySelector('.advancedData').style.display = 'none'
} else {
var id = e.target.getAttribute('data-discord-id'),
    openRn = e.target.querySelector('.advancedData').style.display == 'none',
	advDiv = e.target.querySelector('.advancedData');

if(!playerDats[id]) {

  var req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
	   if(!this.responseText) return
	   playerDats[id] = JSON.parse(this.responseText).playerstats.stats
	   formatAdvData(playerDats[id],advDiv);
    }
  } 
  req.open("GET", "/data?src=steam&mode=730&type=spec&did="+id, true);
  req.send();
} //else formatAdvData(playerDats[id],advDiv)
//show/hide the data div

for(var i = 0, es = document.querySelectorAll('.advancedData'); i < es.length; i++) {
es[i].style.display = 'none'
}
e.target.querySelector('.advancedData').style.display = 'block'
}



}

function toggleQ() {

var q = document.getElementById('q');
if(q.style.left = '0%') {
var c = document.getElementById('content');
q.style.left = c.getBoundingClientRect().left + 'px'
}
q.hidden = !q.hidden
}
document.addEventListener("DOMContentLoaded", init, false);
function init(e) {
document.body.addEventListener('click', function() { if(document.getElementById('q').hidden == false) {document.getElementById('q').hidden = true}});

  var req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
	   if( formatLb(JSON.parse(this.responseText),  function (a,b) {var atk = a.r.stats.find(x => { return x.name == 'total_kills'}).value;var btk = b.r.stats.find(x => { return x.name == 'total_kills'}).value;var atd = a.r.stats.find(x => { return x.name == 'total_deaths'}).value;var btd = b.r.stats.find(x => { return x.name == 'total_deaths'}).value;return (btk / btd) - (atk / atd)}) ) {
	       window.rawData = JSON.parse(this.responseText);
	       endLoad();
	   }
    }
  };
  req.open("GET", "/data?src=steam&mode=730&type=lb&start=0", true);
  req.send();
}

(function(){
  var lastWidth = 0;
  function pollZoomFireEvent() {
    var widthNow = window.innerWidth;
    if (lastWidth == widthNow) return;
    lastWidth = widthNow;
		var q = document.getElementById('q');
		var c = document.getElementById('content');
		q.style.left = c.getBoundingClientRect().left + 'px'
    
  }
  setInterval(pollZoomFireEvent, 100);
})();

(function(){
  var s = window.rawData;
  console.log(s);
  function updateReloadTime() {
    if (!s) { s = window.rawData; if(!s) { return } }
	     var ts = s[0].s.lastReload;
		 var i = 'innerHTML';
		var dN = Date.now();
		var lR = document.getElementById('lastReload');
		if(ts > dN - 30000) lR[i] = 'just now'
		else if (ts > dN - 120000) lR[i] = 'about a minute ago'
		else lR[i] = (Math.floor((dN - ts)/60000)) + ' minutes ago'
		
		if( (Math.floor((dN - ts)/60000)) > 10) document.getElementById('cacheoodwarning').innerHTML = 'Your data is out of date! Reload the page to get up-to-date information.'
    
  }
  setInterval(updateReloadTime, 2000);
})();

function endLoad(i) {
if(!i) {
document.getElementById('loading').style.display = 'none';
document.getElementById('listHolder').style.display = 'block';
} else {  }
}

function middleSortRes(t) {
console.log(t);
[
function() {
	   formatLb(window.rawData,  function (a,b) {var atk = a.r.stats.find(x => { return x.name == 'total_kills'}).value;var btk = b.r.stats.find(x => { return x.name == 'total_kills'}).value;var atd = a.r.stats.find(x => { return x.name == 'total_deaths'}).value;var btd = b.r.stats.find(x => { return x.name == 'total_deaths'}).value;return (btk / btd) - (atk / atd)});
},
function() {
	   formatLb(window.rawData,  function(a,b) { return (b.r.stats.find(x => { return x.name == 'total_contribution_score'}).value - a.r.stats.find(x => { return x.name == 'total_contribution_score'}).value) });
},
function() {
	   formatLb(window.rawData,  function(a,b) { return (b.r.stats.find(x => { return x.name == 'total_matches_won'}).value - a.r.stats.find(x => { return x.name == 'total_matches_won'}).value) });
},
function() {
	   formatLb(window.rawData,  function (a,b) {var atk = a.r.stats.find(x => { return x.name == 'total_shots_hit'}).value;var btk = b.r.stats.find(x => { return x.name == 'total_shots_hit'}).value;var atd = a.r.stats.find(x => { return x.name == 'total_shots_fired'}).value;var btd = b.r.stats.find(x => { return x.name == 'total_shots_fired'}).value;return (btk / btd) - (atk / atd)});
}
][t]()
}