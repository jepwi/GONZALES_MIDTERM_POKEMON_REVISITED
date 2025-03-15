async function fetchPokemon(slot) {
    console.log("Fetching Pokémon for slot", slot);
    const pokemonName = document.getElementById(`pokemon${slot}`).value.toLowerCase().trim();
    const resultDiv = document.getElementById(`result${slot}`);
    
    if (!pokemonName) {
        resultDiv.innerHTML = "Please enter a Pokémon name.";
        return;
    }
    
    try {
        console.log("Fetching data from API...");
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        if (!response.ok) throw new Error("Pokémon not found");
        const data = await response.json();
        
        console.log("Data received:", data);
        
        const stats = data.stats.map(stat => `<li data-stat="${stat.stat.name}" data-value="${stat.base_stat}">${stat.stat.name}: ${stat.base_stat}</li>`).join('');
        const abilities = data.abilities.map(ability => ability.ability.name).join(', ');
        
        resultDiv.innerHTML = `
            <h3>${data.name.toUpperCase()}</h3>
            <img src="${data.sprites.front_default}" alt="${data.name}" onerror="this.onerror=null; this.src='placeholder.png';">
            <p><strong>Stats:</strong></p>
            <ul>${stats}</ul>
            <p><strong>Abilities:</strong> ${abilities}</p>
        `;
    } catch (error) {
        console.error("Error fetching Pokémon:", error);
        resultDiv.innerHTML = "Pokémon not found. Please try again.";
    }
}

function comparePokemon() {
    const result1 = document.getElementById("result1");
    const result2 = document.getElementById("result2");
    let comparisonNote = document.getElementById("comparison-note");
    
    if (!comparisonNote) {
        comparisonNote = document.createElement("div");
        comparisonNote.id = "comparison-note";
        document.body.appendChild(comparisonNote);
    }

    if (!result1.innerHTML || !result2.innerHTML) {
        alert("Please fetch both Pokémon first.");
        return;
    }
    
    const stats1 = Array.from(result1.querySelectorAll("li"));
    const stats2 = Array.from(result2.querySelectorAll("li"));
    
    let total1 = 0, total2 = 0;
    
    stats1.forEach(stat1 => {
        const statName = stat1.getAttribute("data-stat");
        const statValue1 = parseInt(stat1.getAttribute("data-value"));
        const stat2 = stats2.find(s => s.getAttribute("data-stat") === statName);
        if (stat2) {
            const statValue2 = parseInt(stat2.getAttribute("data-value"));
            total1 += statValue1;
            total2 += statValue2;
            
            if (statValue1 > statValue2) {
                stat1.style.color = "green";
                stat2.style.color = "red";
            } else if (statValue2 > statValue1) {
                stat2.style.color = "green";
                stat1.style.color = "red";
            } else {
                stat1.style.color = "white";
                stat2.style.color = "white";
            }
        }
    });
    
    let strongerPokemon = total1 > total2 ? result1.querySelector("h3").innerText : result2.querySelector("h3").innerText;
    comparisonNote.innerHTML = `<strong>${strongerPokemon}</strong> is the stronger Pokémon!`;
    comparisonNote.style.color = "white";
    comparisonNote.style.fontSize = "18px";
    comparisonNote.style.marginTop = "20px";
    comparisonNote.style.textAlign = "center";
}

function clearComparison() {
    document.getElementById("pokemon1").value = "";
    document.getElementById("pokemon2").value = "";
    document.getElementById("result1").innerHTML = "";
    document.getElementById("result2").innerHTML = "";
    let comparisonNote = document.getElementById("comparison-note");
    if (comparisonNote) {
        comparisonNote.innerHTML = "";
    }
}
