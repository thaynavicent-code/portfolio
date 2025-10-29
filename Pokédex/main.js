const pokemonImage = document.getElementById('pokemonImage');
const pokemonName = document.getElementById('pokemonName');
const pokemonNumber = document.getElementById('pokemonNumber');
const pokemonTypes = document.getElementById('pokemonTypes');
const pokemonHeight = document.getElementById('pokemonHeight');
const pokemonWeight = document.getElementById('pokemonWeight');
const pokemonXP = document.getElementById('pokemonXP');

const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');

let currentPokemonId = 1;
const maxPokemon = 151; // Pokédex clássica

// Função para buscar e exibir o Pokémon
async function loadPokemon(id) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!response.ok) throw new Error('Pokémon não encontrado');
        const data = await response.json();

        // Atualiza os dados na tela
        pokemonImage.src =
            data.sprites.other['official-artwork'].front_default ||
            data.sprites.front_default ||
            'assets/img/placeholder.png';

        pokemonName.textContent = data.name;
        pokemonNumber.textContent = `#${data.id.toString().padStart(3, '0')}`;

        // Tipos
        pokemonTypes.innerHTML = data.types
            .map((typeInfo) => `<span class="type ${typeInfo.type.name}">${typeInfo.type.name}</span>`)
            .join('');

        // Altura e peso (convertendo para metros e kg)
        pokemonHeight.textContent = (data.height / 10).toFixed(1) + ' m';
        pokemonWeight.textContent = (data.weight / 10).toFixed(1) + ' kg';

        // XP base
        pokemonXP.textContent = data.base_experience;

    } catch (error) {
        console.error(error);
        pokemonImage.src = 'assets/img/placeholder.png';
        pokemonName.textContent = '???';
        pokemonNumber.textContent = '#000';
        pokemonTypes.innerHTML = '';
        pokemonHeight.textContent = '-';
        pokemonWeight.textContent = '-';
        pokemonXP.textContent = '-';
    }
}

// Navegação
prevButton.addEventListener('click', () => {
    currentPokemonId = currentPokemonId > 1 ? currentPokemonId - 1 : maxPokemon;
    loadPokemon(currentPokemonId);
});

nextButton.addEventListener('click', () => {
    currentPokemonId = currentPokemonId < maxPokemon ? currentPokemonId + 1 : 1;
    loadPokemon(currentPokemonId);
});

// Carrega o primeiro Pokémon ao iniciar
loadPokemon(currentPokemonId);
