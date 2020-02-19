const rp = require('request-promise-native');

async function delay() {
    const durationMs = Math.random() * 800 + 300;
    return new Promise(resolve => {
          setTimeout(() => resolve(), durationMs);
        });
}

async function fetchPlayerYearOverYear(playerId) {
    console.log(`Making API Request for ${playerId}...`);

    const results = await rp({
          uri: 'https://stats.nba.com/stats/playbyplayv2/?gameId=0021900807&startPeriod=0&endPeriod=14',
          headers: {
                  Connection: 'keep-alive',
                  'User-Agent':
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36',
                  'x-nba-stats-origin': 'stats',
                  Referer: `https://stats.nba.com/player/${playerId}/`,
                },
          json: true,
        });
    console.log(results)

}

export async function getPbp() {
    const playerIds = [2544, 201935, 202695, 1629029];
    console.log('Starting script for players', playerIds);

    for (const playerId of playerIds) {
          await fetchPlayerYearOverYear(playerId);
          await delay();
        }

    console.log('Done!');
}
