import namor from 'namor'

const range = len => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newPerson = () => {
  const statusChance = Math.random()
  return {
    firstName: namor.generate({ words: 1, numbers: 0 }),
    lastName: namor.generate({ words: 1, numbers: 0 }),
    age: Math.floor(Math.random() * 30),
    visits: Math.floor(Math.random() * 100),
    progress: Math.floor(Math.random() * 100),
    status:
      statusChance > 0.66
        ? 'relationship'
        : statusChance > 0.33
        ? 'complicated'
        : 'single',
  }
}

export function makeData(...lens) {
  const makeDataLevel = (depth = 0) => {
    const len = lens[depth]
    return range(len).map(d => {
      return {
        ...newPerson(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      }
    })
  }

  return makeDataLevel()
}

function EmissionsData() {
    return (JSON.parse('[{"year":2009,"chemical":"CO2","TPY":8,"notes":"relationship"}, {"year":2010,"chemical":"CO2","TPY":2,"notes":"relationship"}, {"year":2011,"chemical":"CH4","TPY":13,"notes":"single"}, {"year":2012,"chemical":"CO2","TPY":24,"notes":"single"}, {"year":2013,"chemical":"CO2","TPY":16,"notes":"complicated"}, {"year":2014,"chemical":"CO2","TPY":26,"notes":"relationship"}, {"year":2015,"chemical":"CH4","TPY":26,"notes":"relationship"}, {"year":2016,"chemical":"CH4","TPY":29,"notes":"complicated"}]'));
}

function EnergyData(newData) {
  var JsonData = JSON.parse('[{"year":"2000","renewable":"Solar, Wind","notes":"","ATkWh":100,"ATkWh":100},{"year":"2001","renewable":"Solar","notes":"","ATkWh":60,"ATkWh":60},{"year":"2002","renewable":"Solar","notes":"","ATkWh":60,"ATkWh":60},{"year":"2003","renewable":"Solar","notes":"","ATkWh":60,"ATkWh":60},{"year":"2004", "renewable":"Solar", "notes":"", "ATkWh":60, "ATkWh":60},{"year":"2005","renewable":"Solar","notes":"","ATkWh":60,"ATkWh":60},{"year":"2006","renewable":"Solar","notes":"","ATkWh":60,"ATkWh":60},{"year":"2007","renewable":"Solar","notes":"","ATkWh":60,"ATkWh":60},{"year":"2008","renewable":"Solar","notes":"","ATkWh":60,"ATkWh":60},{"year":"2009","renewable":"Solar","notes":"","ATkWh":60,"ATkWh":60},{"year":"2010","renewable":"Solar","notes":"","ATkWh":60,"ATkWh":60},{"year":"2011","renewable":"Solar","notes":"","ATkWh":60,"ATkWh":60},{"year":"2012","renewable":"Solar","notes":"","ATkWh":60,"ATkWh":60},{"year":"2013","renewable":"Solar","notes":"","ATkWh":60,"ATkWh":60},{"year":"2014","renewable":"Solar","notes":"","ATkWh":60,"ATkWh":60},{"year":"2015","renewable":"Solar","notes":"","ATkWh":60,"ATkWh":60},{"year":"2016","renewable":"Solar","notes":"","ATkWh":60,"ATkWh":60},{"year":"2017","renewable":"Solar","notes":"","ATkWh":60,"ATkWh":60},{"year":"2018","renewable":"Solar","notes":"","ATkWh":60,"ATkWh":60},{"year":"2019","renewable":"Solar","notes":"","ATkWh":60,"ATkWh":60}]');
  
  if (newData != null){
    //Here we need to post to the DB
    alert('Edited Data : ' + JSON.stringify(newData))
  }

  return (JsonData);
}

export default function Data(type, newData) {
  if (type === 'Energy') {
    return EnergyData(newData);
  }
  else if (type === 'Emissions') {
    return EmissionsData();
  }
}

//export { staticData, MyData, Data }
