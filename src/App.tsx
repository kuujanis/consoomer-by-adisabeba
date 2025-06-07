import { useCallback, useMemo, useRef, useState } from 'react'
import {Layer, LayerProps, Map, MapLayerMouseEvent, MapRef, NavigationControl, Source} from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import './App.css'
import { Select } from 'antd';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, ChartData, TooltipItem, ChartOptions } from "chart.js";
// import { Bar, Doughnut } from "react-chartjs-2";

import { Doughnut } from 'react-chartjs-2';
import BarChart from './assets/BarChart';

// const COLORS = {
//   'products': '#e20512', //magnit red
//   'mak': '#ef7403', //mak orange
//   'trans': '#ffcc00', //yandex yellow
//   'marketplace': '#7f1371', //wb violet
//   'health': '#ff4f9e',
// }
const styleOptions = [
  {value: 'sum', label: <span>Суммарные расходы</span>},
  {value: 'products', label: <span>Расходы на еду</span>},
  {value: 'mak', label: <span>Расходы на общепит</span>},
  {value: 'trans', label: <span>Расходы на траснпорт</span>},
  {value: 'marketplace', label: <span>Расходы на маркетплейсы</span>},
  {value: 'health', label: <span>Медицинские расходы</span>},
]

const municipal_url = new URL('./assets/mo_potreb_mean_time.geojson', import.meta.url).href;

function App() {

  const mapRef = useRef<MapRef | null>(null)
  // const [load, setLoad] = useState<boolean>(true)

  const [selectedMunicipality, setSelectedMunicipality] = useState<{[name: string]: number}|null>(null)
  const [style,setStyle] = useState<string>('sum')

  ChartJS.register(ArcElement, Tooltip, CategoryScale, LinearScale, BarElement, Title, Legend);



  // const defaultLineLayer: LayerProps = {
  //   id: 'defaultLineLayer',
  //   type: 'line',
  //   paint: {
  //     'line-color': '#08a652',
  //   }
  // }

    const colorPalette: [number,string][] = useMemo(() => {
    switch (style) {
      case 'sum':
        return [                
          [0, '#e6f4ea'],
                [12000, '#b8e2c2'],
                [13000, '#7ccf9e'],
                [14500, '#38b56b'],
                [15000, '#087f4e'],
          ]
      case 'products':
        return [
                [0, '#fde5e7'],
                [12000, '#f6b3b9'],
                [13000, '#ec6d77'],
                [14500, '#d9233a'],
                [15000, '#a1000e']
              ]
      case 'mak':
        return [
                [0, '#fff1db'],
                [1000, '#ffd6a2'],
                [1500, '#fba744'],
                [2000, '#e47300'],
                [5000, '#b55300']
              ]
      case 'trans':
        return [
                [0, '#fffbe0'],
                [1000, '#fff0a6'],
                [2000, '#ffe34d'],
                [3000, '#ffcc00'],
                [4000, '#b38f00']
              ]
      case 'marketplace':
        return [
                [0, '#f4e6f3'],
                [4000, '#daa3d5'],
                [5000, '#b85bb4'],
                [6000, '#861d89'],
                [7000, '#580d5a']
              ]
      case 'health':
        return [
                [0, '#ffe6f0'],
                [1000, '#ffb3d4'],
                [2000, '#ff78b1'],
                [3000, '#e22d80'],
                [4000, '#a60b55']
              ]
      default: return [                
          [0, '#e6f4ea'],
          [12000, '#b8e2c2'],
          [13000, '#7ccf9e'],
          [14500, '#38b56b'],
          [15000, '#087f4e'],
          ]
    }
  
  },[style])

  const configuredFillLayer: LayerProps = useMemo(() => {
    const defOpacity = 0.8
    const defaultFillLayer: LayerProps = {
      id: 'defaultFillLayer',
      type: 'fill',
      beforeId: 'flatSelect'
    }
    switch (style) {
      case 'sum':
        return {
          ...defaultFillLayer,     
          paint: {
            'fill-color': {
              property: 'potreb_sum_mean',
              type: 'interval',
              stops: [
                [0, '#e6f4ea'],
                [8000, '#b8e2c2'],
                [15000, '#7ccf9e'],
                [25500, '#38b56b'],
                [35000, '#087f4e'],
              ]
            },
            'fill-opacity': defOpacity
          }
        }
      case 'products':
        return {
          ...defaultFillLayer,     
          paint: {
            'fill-color': {
              property: 'products',
              type: 'interval',
              stops: [
                [0, '#fde5e7'],
                [12000, '#f6b3b9'],
                [13000, '#ec6d77'],
                [14500, '#d9233a'],
                [15000, '#a1000e']
              ]
            },
            'fill-opacity': defOpacity
          }
        }
      case 'mak':
        return {
          ...defaultFillLayer,     
          paint: {
            'fill-color': {
              property: 'mak',
              type: 'interval',
              stops: [
                [0, '#fff1db'],
                [1000, '#ffd6a2'],
                [1500, '#fba744'],
                [2000, '#e47300'],
                [5000, '#b55300']
              ]
            },
            'fill-opacity': defOpacity
          }
        }
      case 'trans':
        return {
          ...defaultFillLayer,     
          paint: {
            'fill-color': {
              property: 'trans',
              type: 'interval',
              stops: [
                [0, '#fffbe0'],
                [1000, '#fff0a6'],
                [2000, '#ffe34d'],
                [3000, '#ffcc00'],
                [4000, '#b38f00']
              ]
            },
            'fill-opacity': defOpacity
          }
        }
      case 'marketplace':
        return {
          ...defaultFillLayer,     
          paint: {
            'fill-color': {
              property: 'marketplace',
              type: 'interval',
              stops: [
                [0, '#f4e6f3'],
                [4000, '#daa3d5'],
                [5000, '#b85bb4'],
                [6000, '#861d89'],
                [7000, '#580d5a']
              ]
            },
            'fill-opacity': defOpacity
          }
        }
      case 'health':
        return {
          ...defaultFillLayer,     
          paint: {
            'fill-color': {
              property: 'health',
              type: 'interval',
              stops: [
                [0, '#ffe6f0'],
                [1000, '#ffb3d4'],
                [2000, '#ff78b1'],
                [3000, '#e22d80'],
                [4000, '#a60b55']
              ]
            },
            'fill-opacity': defOpacity
          }
        }  
      default: return {
          ...defaultFillLayer,     
          paint: {
            'fill-color': {
              property: 'potreb_sum_mean',
              type: 'interval',
              stops: [
                [0, '#e6f4ea'],
                [8000, '#b8e2c2'],
                [15000, '#7ccf9e'],
                [25500, '#38b56b'],
                [35000, '#087f4e'],
              ]
            },
            'fill-opacity': defOpacity
          }
        }
    }
  
  },[style])

  const onClick = useCallback((e:MapLayerMouseEvent) => {
    if (e.features && e.features.length > 0) {
      console.log(e.features)
      setSelectedMunicipality(e.features[0].properties)
    } else {
      setSelectedMunicipality(null)
    }
  },[])

    const fillSelect: LayerProps = useMemo(() => {
    return {
      id: 'flatSelect',
      type: 'fill',
      paint: {
        'fill-color': 'black',
        'fill-opacity': 0.25
      },
      filter: ['in','territory_id', selectedMunicipality?.territory_id ? selectedMunicipality?.territory_id : '']
    }
  },[selectedMunicipality])

  const data: ChartData<"doughnut", (number | undefined)[], string> = useMemo(() => {
      const data = {
        labels: [
          'Еда', 
          'Общепит', 
          'Транспорт', 
          'Маркетплейсы', 
          'Медицина', 
        ],

        datasets: [
          {
            data: [
              selectedMunicipality?.products, 
              selectedMunicipality?.mak, 
              selectedMunicipality?.trans, 
              selectedMunicipality?.marketplace, 
              selectedMunicipality?.health,
            ],
            backgroundColor: [
              '#e20512',
              '#ef7403',
              '#ffcc00',
              '#7f1371',
              '#ff4f9e',
            ],
          },
        ],
      }
      return data
  },[selectedMunicipality])

  const doughnutOptions: ChartOptions<'doughnut'> = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
          callbacks: {
              label: function(context: TooltipItem<'doughnut'>): string {
                const value = context.raw as number || 0;
                const dataset = context.dataset;
                const total = (dataset.data as number[]).reduce((acc: number, data: number) => acc + data, 0);
                const percentage = Math.round((value / total) * 100);
                return `${percentage}%`;
              }
          }
        }
      }
    }
  },[]);

  const fieldName: string = useMemo(() => {
    switch (style) {
      case 'sum':
        return 'Все категории'
      case 'products':
        return 'Продовольствие'
      case 'mak':
        return 'Общественное питание'
      case 'trans':
        return 'Транспорт'
      case 'marketplace':
        return 'Маркетплейсы'
      case 'health':
        return 'Здоровье' 
      default: return 'Все категории'
    }
  },[style])

  return (

    <div className='main'>
      <div style={{width: '100vw', height: '100vh', display: 'flex', flexDirection: 'row'}}>

          <div style={{
            minWidth: '25%', maxWidth: '25%',  height: '100%', 
            display: 'flex', flexDirection: 'column', alignItems: 'center', 
            backgroundColor: 'white', transition: 'width 0.5s ease'
          }}>
          <div style={{width: '100%', height: '60px', textAlign: 'center', fontSize: '2rem', border: '1px solid #d1d1d1'}}>
            consoomer
          </div>
          <div style={{marginBottom: 10, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <Select 
                style={{width: 300}} 
                onChange={(value: string) => setStyle(value)}
                value={style} options={styleOptions} 
              />
          </div>
                <div style={{ width: 300, marginTop: '25px' }}>
        <div style={{ display: 'flex', height: 16 }}>
          {colorPalette.map(([, color], i) => (
            <div
              key={i}
              style={{
                backgroundColor: color,
                flex: 1
              }}
            />
          ))}
        </div>

        {/* 📊 Value Labels */}
        <div className='scaleTab'>
          {colorPalette.map(([value], i) => (
            <div
              key={i}
              style={{
                flex: 1,
                textAlign: 'center',
                fontSize: 12,
                color: '#333'
              }}
            >
              {value}
            </div>
          ))}
          </div>
        </div>
          {selectedMunicipality && <div style={{padding: '10px', textAlign: 'center'}}>
            <b>{selectedMunicipality?.municipal_district_name_short}</b>
          </div>}
          {selectedMunicipality && <div style={{padding: '10px', textAlign: 'center'}}>
            <b>{fieldName}</b>
          </div>}
          {selectedMunicipality && <div style={{ position: 'relative', width: '160px', height: '160px' }}>
            <Doughnut id='doughnut' options={doughnutOptions} data={data} />
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
            }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {(selectedMunicipality.potreb_sum_mean/1000).toFixed(0)}к ₽
            </div>
            </div>
          </div>}
          {selectedMunicipality && <BarChart palette={colorPalette} properties={selectedMunicipality} name={fieldName}/>}
          {!selectedMunicipality && <div style={{textAlign: 'center'}}>
              <h3> Кликните по объекту на карте для получения статистики</h3>
            </div>}

          
        </div>
        <Map
          ref={mapRef}
          initialViewState={{
            longitude: 37.63,
            latitude: 55.415,
            fitBoundsOptions: {minZoom: 9},
            zoom: 11,
          }}
          style={{width: '75%', height: '100%', transition: 'width 0.5s ease'}}
          mapStyle='https://api.maptiler.com/maps/02e423bb-b55a-4879-8cb6-f365e0a308f7/style.json?key=5UXjcwcX8UyLW6zNAxsl'
          attributionControl={false}
          interactiveLayerIds={['defaultFillLayer']}
          onClick={onClick}
        >
          <Source id='municipal' type='geojson' data={municipal_url}>
            <Layer {...fillSelect} />
            {/* <Layer {...defaultLineLayer}/> */}
            <Layer {...configuredFillLayer}/>
          </Source>
          <NavigationControl style={{position: 'absolute', top: '40px', right: '10px'}}/>
          {/* <Button 
            style={{position: 'absolute', bottom: '50px', right: '10px', height: '40px', width: '100px'}}
          >
            <b>Кварталы</b>
          </Button>
          <Button 
            style={{position: 'absolute', bottom: '10px', right: '10px', height: '40px', width: '100px'}}
          >
            <b>Здания</b>
          </Button> */}
          {/* <div className='siderButton right' onClick={toggleRight}>
            {right ? <RightOutlined/> : <LeftOutlined/>}
          </div>
          <div className='siderButton left' onClick={toggleLeft}>
            {left ? <LeftOutlined/> : <RightOutlined/>}
          </div> */}
        </Map>

      </div>
    </div>


  )
}

export default App
