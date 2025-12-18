let cookieBtn = document.getElementById("cookieBtn")
let cookieDisplay = document.getElementById("cookieDisplay")
let cpsDisplay = document.getElementById("cps")
let stats = document.getElementById("stats")
let upgradeClickerBtn = document.getElementById("upgradeClicker")
let buildingsContainer = document.getElementById("buildings")
let toast = document.getElementById("toast")
let clickUpgradesContainer = document.getElementById("clickUpgrades")
let prestigeBtn = document.getElementById("prestigeBtn")
let prestigeInfo = document.getElementById("prestigeInfo")
let buildingUpgradesContainer = document.getElementById("buildingUpgrades")

let goldenCookie = document.getElementById("goldenCookie")
let boostActive = false
let boostMultiplier = 7
let boostTime = 10

let prestigeChips = 0
let prestigeMultiplier = 0

let baseStatsText = "";

let cookies = 0

let buyAmount = 1; 

let buildings = [
    {name: "Cursor", count: 0, baseCost: 15, cost: 15, cps: 0.1},
    {name: "Auto Clicker", count: 0, baseCost: 100, cost: 100, cps: 0.5},
    {name: "Grandma", count: 0, baseCost: 300, cost: 300, cps: 1},
    {name: "Farm", count: 0, baseCost: 1100, cost: 1100, cps: 8},
]

let achievements = [
    {id: "first_click", name: "First Cookie", desc: "Click your first cookie!", unlocked: false, condition: () => cookies >= 1},
    {id:"thousand_cookies", name: "Cookie hoarder", desc: "Reach 1K cookies!", unlocked: false, condition: () => cookies >= 1000},
    {id: "ten_buildings", name: "Builder", desc: "Own 10 buildings!", unlocked: false, condition: () => buildings.reduce((t,b) => t + b.count, 0) >= 10},
    {id: "frenzy", name: "Lucky star", desc: "Trigger a golden cookie frenzy!", unlocked: false, condition: () => boostActive === true}
]

let buildingUpgrades = [
    { building: "Cursor", name:"Reinforced Fingers", cost:200, bonus:2, owned:false, unlock:10 },
    { building: "Grandma", name:"Steel Rolling Pins", cost:700, bonus:2, owned:false, unlock:5 },
    { building: "Farm", name:"Fertilizer Upgrade", cost:3000, bonus:2, owned:false, unlock:3 }
]

let clickUpgrades = [
    {name: "Stronger Clicks", level: 1, cost: 25, power: 1},
    {name: "Super Clicks", level: 0, cost: 100, power: 5},
    {name: "Mega Clicks", level: 0, cost: 500, power: 20}
] 

document.querySelectorAll("#bulkBuySelector button").forEach(btn => {
    btn.onclick = () => {
        buyAmount = Number(btn.getAttribute("data-amount"));
        document.querySelectorAll("#bulkBuySelector button").forEach(b => b.style.background = "");
        btn.style.background = "#ffd700";
    };
});

function getBuildingCost(b, amount){
    let cost = 0;
    let tempCost = b.cost;
    for(let i = 0; i < amount; i++){
        cost += tempCost;
        tempCost *= 1.15;
    }
    return cost;
}


function setBuyAmount(amount){
    buyAmount = amount;
    updateDisplay(); 
    updateBuySelectorStyle();
}

function updateBuySelectorStyle(){
    document.querySelectorAll("#buySelector button").forEach(btn => {
        btn.style.background = parseInt(btn.innerText) === buyAmount ? "yellow" : "";
    });
}


prestigeBtn.onclick = ascend

let nextGain = calculatePrestigeGain()
prestigeInfo.innerText = `Prestige Chips: ${formatNumber(prestigeChips)} (+${formatNumber(prestigeMultiplier * 100)})% | Next: ${formatNumber(nextGain)}`

function getClickPower() {
    let power = 0;
    clickUpgrades.forEach(up => {
        power += up.level * up.power;
    });

    power *= (1 + prestigeMultiplier);
    return power;
}

function getClickUpgradeCost(up, amount){
    let cost = 0;
    let tempCost = up.cost;
    for(let i = 0; i < amount; i++){
        cost += tempCost;
        tempCost *= 1.4; 
    }
    return cost;
}

function buyClickUpgrade(index){
    let up = clickUpgrades[index];
    let cost = getClickUpgradeCost(up, buyAmount); 

    if(cookies >= cost){
        cookies -= cost;

        up.level += buyAmount;
        up.cost *= Math.pow(1.4, buyAmount); 

        updateDisplay();
        renderClickUpgrades();
    } else {
        showToast(`Not enough cookies for ${up.name} x${buyAmount}`);
    }
}


function updateDisplay() {

    let earned = calculatePrestigeGain();
    let nextGain = earned;

    prestigeBtn.disabled = earned <= 0;
    prestigeBtn.setAttribute(
        "data-tooltip",
        earned <= 0
            ? `Requires 100k cookies to gain Prestige`
            : `Ascend now to gain ${formatNumber(earned)} Prestige Chips (+${(prestigeChips + earned) * 1}%)`
    );

    prestigeInfo.innerText = `Prestige Chips: ${formatNumber(prestigeChips)} (+${(prestigeMultiplier * 100).toFixed(1)}%) | Next: ${formatNumber(nextGain)}`;

    let totalCps = 0;

    buildings.forEach(b => {
        let multiplier = 1;
        b.count = Number(b.count) || 0;
        b.cps = Number(b.cps) || 0;
        b.cost = Number(b.cost) || b.baseCost;

        buildingUpgrades.forEach(up => {
            if(up.building === b.name && up.owned){
                multiplier *= up.bonus;
            }
        });

        totalCps += b.count * b.cps * multiplier;
    });

    let displayCps = totalCps * (boostActive ? boostMultiplier : 1) * (1 + prestigeMultiplier);
    cpsDisplay.innerText = "per second: " + formatNumber(displayCps);

    let clickPower = getClickPower();
    baseStatsText = `Click Power: ${formatNumber(clickPower)} x | Buildings: ${buildings.reduce((a,b) => a+b.count,0)}`;
    stats.innerText = boostActive ? baseStatsText + " | ✨ FRENZY!" : baseStatsText;

    cookieDisplay.innerText = "Cookies: " + formatNumber(cookies);

    if(clickUpgradesContainer){
        clickUpgradesContainer.querySelectorAll("button").forEach((btn, i) =>{
            btn.disabled = cookies < clickUpgrades[i].cost;
        });
    }

    renderClickUpgrades();

    buildingsContainer.querySelectorAll("button").forEach((btn, i) => {
        btn.disabled = cookies < getBuildingCost(buildings[i], buyAmount);
    });

    clickUpgradesContainer.querySelectorAll("button").forEach((btn, i) => {
        btn.disabled = cookies < getClickUpgradeCost(clickUpgrades[i], buyAmount);
    });

    buildingUpgradesContainer.querySelectorAll("button").forEach((btn, i) => {
        let up = buildingUpgrades[i];
        btn.disabled = up.owned || cookies < up.cost;
    });

    renderBuildingUpgrades();
}

// Set default bulk buy selection and highlight
buyAmount = 1;
updateBuySelectorStyle(); // ensures 1 is highlighted at start

document.querySelectorAll("#bulkBuySelector button").forEach(btn => {
    btn.onclick = () => {
        buyAmount = Number(btn.getAttribute("data-amount"));
        updateBuySelectorStyle();
        updateDisplay(); // update buttons immediately
    };
});

function buyBuilding(index){
    let b = buildings[index];
    let cost = getBuildingCost(b, buyAmount);

    if(cookies >= cost){
        cookies -= cost;
        for(let i = 0; i < buyAmount; i++){
            b.count++;
            b.cost *= 1.15;
        }
        updateDisplay();
        renderBuildings();
    } else {
        showToast(`Not enough cookies for ${b.name} x${buyAmount}`);
    }
}

function renderBuildings(){
    buildingsContainer.innerHTML = "";
    buildings.forEach((b, i) => {
        let wrapper = document.createElement("div");
        let btn = document.createElement("button");

        let totalCost = getBuildingCost(b, buyAmount);
        btn.innerText = `${b.name} (${b.count}) - ${formatNumber(totalCost)} cookies`;

        let multiplier = 1;
        buildingUpgrades.forEach(upg => {
            if(upg.building === b.name && upg.owned) multiplier *= upg.bonus;
        });

        btn.setAttribute("data-tooltip", `+${formatNumber(b.cps * b.count * multiplier * (1 + prestigeMultiplier) * (boostActive ? boostMultiplier : 1))} cookies/sec`);
        btn.disabled = cookies < totalCost;

        btn.onclick = () => buyBuilding(i);

        wrapper.appendChild(btn);
        buildingsContainer.appendChild(wrapper);
    });
}

function renderClickUpgrades() {
    clickUpgradesContainer.innerHTML = "";
    clickUpgrades.forEach((up, i) => {
        let wrapper = document.createElement("div");
        let btn = document.createElement("button");

        let totalCost = getClickUpgradeCost(up, buyAmount);
        btn.innerText = `${up.name} LV.${up.level} - ${formatNumber(totalCost)} cookies`;

        btn.setAttribute("data-tooltip", `+${formatNumber(up.power * up.level * (1 + prestigeMultiplier))} click power per click`);
        btn.disabled = cookies < getClickUpgradeCost(up, buyAmount);

        btn.onclick = () => buyClickUpgrade(i);

        wrapper.appendChild(btn);
        clickUpgradesContainer.appendChild(wrapper);
    });
}


function spawnGoldenCookie(){
    if(goldenCookie.style.display === "block") return

    let x = Math.random() * (window.innerWidth - 80)
    let y = Math.random() * (window.innerHeight - 80)

    goldenCookie.style.left = x + "px"
    goldenCookie.style.top = y + "px"
    goldenCookie.style.display = "block"

    setTimeout(() => {
        goldenCookie.style.display = "none"
    }, 6000)
}

function activateGoldenBuff(){
    if(boostActive) return;
    boostActive = true;

    showToast("Golden Cookie Frenzy! 🍪✨")

    updateDisplay();

    setTimeout(() => {
        boostActive = false;
        updateDisplay();
    }, boostTime * 1000)
}

goldenCookie.onclick = () => {
    goldenCookie.style.display = "none"
    activateGoldenBuff()
}

cookieBtn.addEventListener('click', (e) => {
    let clickPower = getClickPower(); 
    let gain = boostActive ? clickPower * boostMultiplier : clickPower;
    cookies += gain;
    gain = gain

    spawnFloatNumber(formatNumber(gain), e.clientX, e.clientY);

    cookieBtn.classList.add("pop");
    setTimeout(() => cookieBtn.classList.remove("pop"), 50);
    updateDisplay();
});

function buyBuildingUpgrade(up){
    if(cookies < up.cost){
        showToast("Not enough cookies for upgrade!")
        return
    }

    cookies -= up.cost
    up.owned = true

    showToast(`${up.name} unlocked!`)
    updateDisplay()
    renderBuildingUpgrades()
}

function renderBuildingUpgrades(){
    buildingUpgradesContainer.innerHTML = ""

    buildingUpgrades.forEach(up => {

        let b = buildings.find(b => b.name === up.building)
        if(b.count < up.unlock || up.owned) return

        let wrapper = document.createElement("div")
        
        let btn = document.createElement("button")
        btn.innerText = `${up.name} (${up.building}) - ${formatNumber(up.cost)} cookies`
        btn.setAttribute("data-tooltip", `x${up.bonus} boost to ${up.building}`)
        btn.disabled = cookies < up.cost

        btn.onclick = () => {
            if(btn.disabled){
                showToast("Not enough cookies!")
            } else {
                buyBuildingUpgrade(up); 
            }
        }

        wrapper.appendChild(btn)
        buildingUpgradesContainer.appendChild(wrapper)

    })
}

function saveGame(){
    let saveData = {
        achievements: achievements,
        cookies: cookies,
        buildings: buildings,
        clickUpgrades: clickUpgrades,
        prestigeChips: prestigeChips,
        buildingUpgrades: buildingUpgrades,
        time: Date.now()
    }

    localStorage.setItem("cookieSave", JSON.stringify(saveData))
}

function loadGame(){
    let save = localStorage.getItem("cookieSave")

    if (save){
        let data = JSON.parse(save)

        cookies = data.cookies || 0
        buildings = data.buildings || buildings
        clickUpgrades = data.clickUpgrades || clickUpgrades
        prestigeChips = data.prestigeChips || 0
        prestigeMultiplier = prestigeChips * 0.01
        buildingUpgrades = data.buildingUpgrades || buildingUpgrades
        
        if(data.achievements){
            achievements = data.achievements;

            achievements.forEach(a => {
                if(a.id === "first_click") a.condition = () => cookies >= 1;
                else if(a.id === "thousand_cookies") a.condition = () => cookies >= 1000;
                else if(a.id === "ten_buildings") a.condition = () => buildings.reduce((t,b) => t + b.count, 0) >= 10;
                else if(a.id === "frenzy") a.condition = () => boostActive === true;
            });
        }


        let lastTime = data.time || Date.now()
        let now = Date.now()
        let secondsAway = (now - lastTime) / 1000

        let totalCps = 0
        buildings.forEach(b => {

            let multiplier = 1
            
            b.count = Number(b.count) || 0
            b.cps = Number(b.cps) || 0      
            b.cost = Number(b.cost) || b.baseCost

            buildingUpgrades.forEach(up => {
                if(up.building === b.name && up.owned){
                    multiplier *= up.bonus
                }
            })

            totalCps += b.count * b.cps * multiplier
        })

        cookies += totalCps * secondsAway
    }

    renderBuildings()
    updateDisplay()
}

function checkAchievements(){
    achievements.forEach(a => {
        if(!a.unlocked && a.condition()){
            a.unlocked = true
            showAchievementToast(a)
            saveGame()
        }
    })
}

let toastContainer = document.createElement("div");
toastContainer.style.position = "fixed";
toastContainer.style.bottom = "20px";
toastContainer.style.right = "20px";
toastContainer.style.display = "flex";
toastContainer.style.flexDirection = "column-reverse"; 
toastContainer.style.gap = "8px";
toastContainer.style.zIndex = 9999;
document.body.appendChild(toastContainer);

function showToast(message, duration = 3000) {
    let el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = message;

    Object.assign(el.style, {
        background: "rgba(0,0,0,0.75)",
        color: "#fff",
        padding: "8px 12px",
        borderRadius: "5px",
        minWidth: "120px",
        maxWidth: "250px",
        wordWrap: "break-word",
        boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
        opacity: 0,
        transform: "translateY(10px)",
        transition: "opacity 0.2s ease, transform 0.2s ease"
    });

    toastContainer.appendChild(el);

    requestAnimationFrame(() => {
        el.style.opacity = 1;
        el.style.transform = "translateY(0)";
    });

    setTimeout(() => {
        el.style.opacity = 0;
        el.style.transform = "translateY(-10px)";
        setTimeout(() => el.remove(), 200);
    }, duration);
}

function showAchievementToast(a){
    showToast(`<strong>${a.name}</strong><br><small>${a.desc}</small>`);
}


function spawnFloatNumber(amount, x, y){
    x = Math.min(x, window.innerWidth - 50)
    y = Math.min(y, window.innerHeight - 50)

    let el = document.createElement("div")
    el.className = "float-number"
    el.innerText = `+${amount}`

    el.style.left = x + "px"
    el.style.top = y + "px"

    document.body.appendChild(el)

    setTimeout(() => el.remove(), 1000)
}

function calculatePrestigeGain(){
    return Math.floor(Math.sqrt(cookies / 100000))
}

function ascend(){
    let earned = calculatePrestigeGain()
    if(earned <= 0) return showToast("Not enough cookies for prestige yet!")

        prestigeChips += earned
        prestigeMultiplier = prestigeChips * 0.01

        cookies = 0

        buildings.forEach(b => {
            b.count = 0
            b.cost = b.baseCost
        })

        clickUpgrades.forEach((up, i) => {
            if(i === 0){
                up.level = 1
                up.cost = 25
            }else{
                up.level = 0
                up.cost = up.baseCost || up.cost
            }
        })

        achievements.forEach(a => {
            a.unlocked = false
        })

        saveGame()

        renderBuildings()
        renderClickUpgrades()
        updateDisplay()

        showToast(`Ascended! Gained ${earned} Prestige chips!`)
}

function formatNumber(num) {
    if (num < 1000) return num.toFixed(0);

    const suffixes = [
        "", "k", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", 
        "Dc", "Ud", "Dd", "Td", "Qad", "Qid", "Sxd", "Spd", "Ocd", "Nod",
        "Vg", "Uvg", "Dvg", "Tvg", "Qavg", "Sxvg", "Spvg", "Ocvg", "Novg", "Tg",
        "Utg", "Dtg", "Ttg", "Qatg", "Qitg", "Sxtg", "Sptg", "Octg", "Notg", "Cg",
        "Ucg", "Dcg", "Tcg", "Qacg", "Qicg", "Sxcg", "Spcg", "Occg", "Nocg", "Gg"
    ];

    let tier = Math.floor(Math.log10(num) / 3);
    if (tier >= suffixes.length) tier = suffixes.length - 1;

    const scale = Math.pow(10, tier * 3);
    const scaled = num / scale;

    let decimals = scaled < 100 ? 2 : scaled < 1000 ? 1 : 0;

    return scaled.toFixed(decimals) + suffixes[tier];
}


setInterval(function(){
    let totalCps = 0

    buildings.forEach(b => {
        let multiplier = 1
        buildingUpgrades.forEach(up => {
            if(up.building === b.name && up.owned){
                multiplier *= up.bonus
            }
        })
        totalCps += b.count * b.cps * multiplier
    })


    let cpsGain = totalCps * (boostActive ? boostMultiplier : 1) * (1 + prestigeMultiplier);
    cookies += cpsGain / 6; 


    updateDisplay()
    checkAchievements()
}, 1000/6)

setInterval(() => {
    if(Math.random() < 0.5){
        spawnGoldenCookie()
    }
}, 30000)

setInterval(saveGame, 5000)

loadGame()
renderBuildings()
renderClickUpgrades()
updateDisplay()