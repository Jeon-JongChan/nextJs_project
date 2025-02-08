function genBattleDialog() {
    let battle = document.querySelector('#battle');
    let effectDialog = [
      "효과가 없는 것 같다...",
      "효과가 매우 부족한 것 같다...",
      "효과가 부족한 것 같다...",
      '',
      "효과가 굉장했다!",
      "효과가 매우 굉장했다!"
    ]
    let input1 = {
      name: battle.querySelector("#bname1").value,
      skill: battle.querySelector("#bskill1").value,
      health: battle.querySelector("#bhealth1").value,
      damage: battle.querySelector("#bdamage1").value,
    }
    let input2 = {
      name: battle.querySelector("#bname2").value,
      skill: battle.querySelector("#bskill2").value,
      health: battle.querySelector("#bhealth2").value,
      damage: battle.querySelector("#bdamage2").value,
    }
    if(!input1.name || !input2.name) {
      alert("포켓몬 이름이 다 채워지지 않았습니다.");
      return null;
    }
    if(!input1.skill || !input2.skill) {
      alert("포켓몬 기술이 다 채워지지 않았습니다.");
      return null;
    }

    var names = battle.querySelectorAll('.bd-name1');
    let damage1 = battleDamage(input1.damage);
    let damage2 = battleDamage(input2.damage);

    names[0].innerText = input1.name;
    names[1].innerText = input1.name;
    battle.querySelector('.bd-skill1').innerText = input1.skill;
    battle.querySelector('.bd-damage1').innerText = damage1;
    battle.querySelector('.bd-effect1').innerText = effectDialog[input1.damage*1];
    battle.querySelector('.bd-health1').innerText = input1.health-damage2;
    
    names = battle.querySelectorAll('.bd-name2');
    names[0].innerText = input2.name;
    names[1].innerText = input2.name;
    battle.querySelector('.bd-skill2').innerText = input2.skill;
    battle.querySelector('.bd-damage2').innerText = damage2;
    battle.querySelector('.bd-effect2').innerText = effectDialog[input2.damage*1];
    battle.querySelector('.bd-health2').innerText = input2.health-damage1;
  }
  function battleDamage(option = 3) {
    if(option==="0") return 0
    else if(option==="1") return getRandomInt(0,10+1)
    else if(option==="2") return getRandomInt(11,20+1)
    else if(option==="3") return getRandomInt(21,40+1)
    else if(option==="4") return getRandomInt(41,70+1)
    else if(option==="5") return getRandomInt(71,90+1)
  }




  function changeMenu(menu) {
    getJsonData();
    let admin = document.querySelector("#admin");
    let main = document.querySelector("#main");
    let battle = document.querySelector("#battle");
    if(menu==="admin"){
      if(admin) admin.style.display="block";
      if(main) main.style.display="none";
      if(battle) battle.style.display="none";
    }
    else if(menu==="main"){
      if(admin) admin.style.display="none";
      if(main) main.style.display="block";
      if(battle) battle.style.display="none";
    }
    else if(menu==="battle"){
      if(admin) admin.style.display="none";
      if(main) main.style.display="none";
      if(battle) battle.style.display="block";
    }
    console.log("메뉴변경 완료 : ",menu);
  }
  async function genPoketSelector() {
    let parent = document.querySelector(".poketmon-select");
    let youtube_url = document.querySelector("#youtube-url").value;
    let player = document.querySelector("#player").value;
    let local = document.querySelector("#local").value;

    if(!player) {
      alert("플레이어 이름이 존재하지않습니다.");
    }
    else if(!local) {
      alert("지역이 존재하지않습니다.");
    }
    
    // let plevel = document.querySelector(".plevel");
    // let minlevel = plevel.querySelector("plevel-min").value;
    // let maxlevel = plevel.querySelector("plevel-max").value;
    let poket1 = randomPoketmon(local);
    console.log("포켓몬 랜덤 생성 작동");
    let poket2 = randomPoketmon(local,poket1.name);

    parent.querySelector(".music").innerText=youtube_url;
    parent.querySelector(".player1").innerText=player;
    parent.querySelector(".player2").innerText=player;
    parent.querySelector(".poket1").innerText=poket1.name;
    parent.querySelector("#poket1-img").src=await firebaseGetFileUrl(poket1.image);
    parent.querySelector(".poket2").innerText=poket2.name;
    parent.querySelector("#poket2-img").src=await firebaseGetFileUrl(poket2.image);
  }
  async function genPoketBattle() {
    console.log("포켓몬 전투 작동");
    let parent = document.querySelector(".poketmon-battle");
    let youtube_url = document.querySelector("#youtube-url").value;
    let player = document.querySelector("#player").value;

    let poketname = document.querySelector("#selected-poketmon").value;
    let poket_idx = getNameIdx(json.poketmon,poketname);
    if(poket_idx === -1) alert("포켓몬 이름이 이상합니다.");


    let plevel = document.querySelector(".plevel");
    let minlevel = plevel.querySelector("#plevel-min").value;
    let maxlevel = plevel.querySelector("#plevel-max").value;
    let level = getRandomInt(minlevel, maxlevel);
    let spec = getRandomValue(json.spec);

    parent.querySelector(".music").innerText=youtube_url;
    parent.querySelector(".pspec").innerText=spec.name;
    parent.querySelector(".player1").innerText=player;
    parent.querySelector(".pname").innerText=poketname;
    parent.querySelector(".plevel").innerText=level;
    parent.querySelector(".ppersonal").innerText=randomPersonal(json.poketmon[poket_idx]);
    //console.log(" test : ",poket_idx,json.poketmon[poket_idx]);
    parent.querySelector("#poket-img").src=await firebaseGetFileUrl(json.poketmon[poket_idx].image);

  }

  function randomPoketmon(local, exceptName=null)
  {
    let poketmons = []
    let ret = null;
    for(let i=0; i<json.poketmon.length; i++) {
      let poketmon = json.poketmon[i];
      if(poketmon.local === local) {
        if(exceptName && exceptName === poketmon.name) {
            ret = poketmon;
            continue;
        }
        poketmons.push(poketmon); 
      }
    }
    let temp = poketmons;
    poketmons = poketmonRandomSort(poketmons);
    console.log('randomPoketmon : ',temp,'->',poketmons);
    if(poketmons.length === 0) return ret;
    ret = getPoketmon(poketmons);
    return ret;
  }
  function poketmonRandomSort(poketmons) {
    let limit=0;
    let ret = [];

    while(poketmons.length > 0) {
      limit += 1;
      if(limit > 1000) break;
      let idx = getRandomInt(0, poketmons.length);
      ret.push(poketmons.splice(idx,1)[0]);
    }
    return ret;
  }
  function getPoketmon(poketmons) {
      let ret = null;
      let limit = 0;
      while(!ret) {
          limit++;
          if(limit > 1000) break;
          for(let i=0; i<poketmons.length; i++) {
              let target = poketmons[i];
              let random = getRandomInt(0,100);
              if(random < target.rare) {
                  ret = poketmons[i];
                  break;
              }
          }
      }
      return ret;
  }

  function randomPersonal(poketmon) {
    let randomIdx = getRandomInt(0,5);
    console.log("randomPersonal : ",poketmon,randomIdx);
    if(randomIdx === 0 || randomIdx === 1) return poketmon.personal[0]
    else if(randomIdx === 2 || randomIdx === 3) return poketmon.personal[1]
    else if(randomIdx === 4) return poketmon.personal[2]
  }