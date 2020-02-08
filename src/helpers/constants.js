export const TEAM_TO_TEAM_ABBR = {
  'ATLANTA HAWKS': 'ATL',
  'ST. LOUIS HAWKS': 'SLH',
  'MILWAUKEE HAWKS': 'MIL',
  'TRI-CITIES BLACKHAWKS': 'TCB',
  'BOSTON CELTICS': 'BOS',
  'BROOKLYN NETS': 'BKN',
  'NEW JERSEY NETS' : 'NJN',
  'NEW YORK NETS' : 'NYN',
  'CHICAGO BULLS': 'CHI',
  'CHARLOTTE HORNETS': 'CHA',
  'CHARLOTTE BOBCATS' : 'CHA',
  'CLEVELAND CAVALIERS': 'CLE',
  'DALLAS MAVERICKS': 'DAL',
  'DENVER NUGGETS': 'DEN',
  'DETROIT PISTONS': 'DET',
  'FORT WAYNE PISTONS': 'FWP',
  'GOLDEN STATE WARRIORS': 'GSW',
  'SAN FRANCISCO WARRIORS': 'SFW',
  'PHILADELPHIA WARRIORS': 'PHI',
  'HOUSTON ROCKETS': 'HOU',
  'SAN DIEGO ROCKETS': 'HOU',
  'INDIANA PACERS': 'IND',
  'LOS ANGELES CLIPPERS': 'LAC',
  'SAN DIEGO CLIPPERS': 'SDC',
  'BUFFALO BRAVES': 'BUF',
  'LOS ANGELES LAKERS': 'LAL',
  'MINNEAPOLIS LAKERS': 'MIN',
  'MEMPHIS GRIZZLIES': 'MEM',
  'VANCOUVER GRIZZLIES' : 'VAN',
  'MIAMI HEAT': 'MIA',
  'MILWAUKEE BUCKS': 'MIL',
  'MINNESOTA TIMBERWOLVES': 'MIN',
  'NEW ORLEANS PELICANS' : 'NOP',
  'NEW ORLEANS/OKLAHOMA CITY HORNETS' : 'NOK',
  'NEW ORLEANS HORNETS' : 'NOH',
  'NEW YORK KNICKS' : 'NYK',
  'OKLAHOMA CITY THUNDER' : 'OKC',
  'SEATTLE SUPERSONICS' : 'SEA',
  'ORLANDO MAGIC' : 'ORL',
  'PHILADELPHIA 76ERS' : 'PHI',
  'SYRACUSE NATIONALS' : 'SYR',
  'PHOENIX SUNS' : 'PHX',
  'PORTLAND TRAIL BLAZERS' : 'POR',
  'SACRAMENTO KINGS' : 'SAC',
  'KANSAS CITY KINGS' : 'KCK',
  'KANSAS CITY-OMAHA KINGS' : 'KCK',
  'CINCINNATI ROYALS' : 'CIN',
  'ROCHESTER ROYALS': 'ROR',
  'SAN ANTONIO SPURS' : 'SAS',
  'TORONTO RAPTORS' : 'TOR',
  'UTAH JAZZ' : 'UTA',
  'NEW ORLEANS JAZZ' : 'NOJ',
  'WASHINGTON WIZARDS' : 'WAS',
  'WASHINGTON BULLETS' : 'WAS',
  'CAPITAL BULLETS' : 'CAP',
  'BALTIMORE BULLETS' : 'BAL',
  'CHICAGO ZEPHYRS' : 'CHI',
  'CHICAGO PACKERS' : 'CHI',
  'ANDERSON PACKERS': 'AND',
  'CHICAGO STAGS': 'CHI',
  'INDIANAPOLIS OLYMPIANS': 'IND',
  'SHEBOYGAN RED SKINS': 'SRS',
  'ST. LOUIS BOMBERS': 'SLB',
  'WASHINGTON CAPITOLS' : 'WAS',
  'WATERLOO HAWKS': 'WAT',
}

export const colors = {'ATL': {'main_color': 'red', 'secondary_color': 'white'}, 'BKN': {'main_color': 'black', 'secondary_color': 'white'}, 'BOS': {'main_color': 'green', 'secondary_color': 'white'}, 'CHA': {'main_color': 'purple', 'secondary_color': 'teal'}, 'CHI': {'main_color': 'red', 'secondary_color': 'black'}, 'CLE': {'main_color': 'wine', 'secondary_color': 'gold'}, 'DAL': {'main_color': 'blue', 'secondary_color': 'silver'}, 'DEN': {'main_color': 'blue', 'secondary_color': 'gold'}, 'DET': {'main_color': 'blue', 'secondary_color': 'red'}, 'GSW': {'main_color': 'gold', 'secondary_color': 'blue'}, 'HOU': {'main_color': 'red', 'secondary_color': 'silver'}, 'IND': {'main_color': 'blue', 'secondary_color': 'gold'}, 'LAC': {'main_color': 'red', 'secondary_color': 'blue'}, 'LAL': {'main_color': 'purple', 'secondary_color': 'gold'}, 'MEM': {'main_color': 'midnightBlue', 'secondary_color': 'bealeStreetBlue'}, 'MIA': {'main_color': 'red', 'secondary_color': 'black'}, 'MIL': {'main_color': 'green', 'secondary_color': 'cream'}, 'MIN': {'main_color': 'blue', 'secondary_color': 'green'}, 'NOP': {'main_color': 'blue', 'secondary_color': 'red'}, 'NYK': {'main_color': 'blue', 'secondary_color': 'orange'}, 'OKC': {'main_color': 'blue', 'secondary_color': 'orange'}, 'ORL': {'main_color': 'blue', 'secondary_color': 'silver'}, 'PHI': {'main_color': 'blue', 'secondary_color': 'red'}, 'PHX': {'main_color': 'orange', 'secondary_color': 'purple'}, 'POR': {'main_color': 'red', 'secondary_color': 'black'}, 'SAC': {'main_color': 'purple', 'secondary_color': 'silver'}, 'SAS': {'main_color': 'silver', 'secondary_color': 'black'}, 'TOR': {'main_color': 'red', 'secondary_color': 'silver'}, 'UTA': {'main_color': 'navy', 'secondary_color': 'yellow'}, 'WAS': {'main_color': 'navy', 'secondary_color': 'red'}}

export const getRandomColor = (t1, t2) => {
  const p = Math.random()
  const t1Abbr = TEAM_TO_TEAM_ABBR[t1]
  const t2Abbr = TEAM_TO_TEAM_ABBR[t2]
  if(p<0.35)
    return colors[t1Abbr]['main_color']
  else if(p<0.7)
    return colors[t2Abbr]['main_color']
  else if(p<0.85)
    return colors[t1Abbr]['secondary_color']
  else
    return colors[t2Abbr]['secondary_color']
}
