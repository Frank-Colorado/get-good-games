const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '98130aea35mshbfb748cb4a43a69p1b740bjsne04853877c19',
		'X-RapidAPI-Host': 'cheapshark-game-deals.p.rapidapi.com'
	}
};

fetch('https://cheapshark-game-deals.p.rapidapi.com/games?title=batman&exact=0&limit=60', options)
	.then(response => response.json())
	.then(response => console.log(response))
	.catch(err => console.error(err));
