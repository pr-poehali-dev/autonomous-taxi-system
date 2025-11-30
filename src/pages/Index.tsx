import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Vehicle {
  id: string;
  status: 'active' | 'idle' | 'charging' | 'maintenance';
  battery: number;
  location: { x: number; y: number };
  speed: number;
  passengers: number;
}

const Index = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: 'LID-001', status: 'active', battery: 87, location: { x: 25, y: 30 }, speed: 45, passengers: 2 },
    { id: 'LID-002', status: 'idle', battery: 95, location: { x: 60, y: 45 }, speed: 0, passengers: 0 },
    { id: 'LID-003', status: 'active', battery: 72, location: { x: 40, y: 65 }, speed: 38, passengers: 1 },
    { id: 'LID-004', status: 'charging', battery: 45, location: { x: 75, y: 25 }, speed: 0, passengers: 0 },
    { id: 'LID-005', status: 'active', battery: 91, location: { x: 50, y: 80 }, speed: 52, passengers: 3 },
    { id: 'LID-006', status: 'maintenance', battery: 0, location: { x: 85, y: 55 }, speed: 0, passengers: 0 },
  ]);

  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles(prevVehicles =>
        prevVehicles.map(vehicle => {
          if (vehicle.status === 'active') {
            return {
              ...vehicle,
              location: {
                x: (vehicle.location.x + (Math.random() - 0.5) * 3) % 100,
                y: (vehicle.location.y + (Math.random() - 0.5) * 3) % 100,
              },
              speed: Math.max(20, Math.min(60, vehicle.speed + (Math.random() - 0.5) * 10)),
              battery: Math.max(0, vehicle.battery - 0.1),
            };
          }
          return vehicle;
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-primary';
      case 'idle':
        return 'bg-secondary';
      case 'charging':
        return 'bg-yellow-500';
      case 'maintenance':
        return 'bg-destructive';
      default:
        return 'bg-muted';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'В пути';
      case 'idle':
        return 'Ожидание';
      case 'charging':
        return 'Зарядка';
      case 'maintenance':
        return 'Обслуживание';
      default:
        return status;
    }
  };

  const activeVehicles = vehicles.filter(v => v.status === 'active').length;
  const totalVehicles = vehicles.length;
  const avgBattery = Math.round(vehicles.reduce((acc, v) => acc + v.battery, 0) / vehicles.length);
  const totalPassengers = vehicles.reduce((acc, v) => acc + v.passengers, 0);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <img 
              src="https://cdn.poehali.dev/files/46f674e1-eb83-45ae-8017-14dcaf4d2b90.png" 
              alt="LIDcar logo" 
              className="h-10 w-auto object-contain brightness-0 invert hue-rotate-[250deg] saturate-[3]"
              style={{ filter: 'brightness(0) saturate(100%) invert(47%) sepia(87%) saturate(3089%) hue-rotate(243deg) brightness(98%) contrast(101%)' }}
            />
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-4 py-2 text-sm">
              <Icon name="Wifi" size={16} className="mr-2" />
              Онлайн
            </Badge>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 bg-card border-border hover:border-primary transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm">Активные автомобили</span>
              <Icon name="Car" size={20} className="text-primary" />
            </div>
            <div className="text-3xl font-bold text-foreground">{activeVehicles}/{totalVehicles}</div>
            <div className="text-xs text-muted-foreground mt-2">
              {Math.round((activeVehicles / totalVehicles) * 100)}% флота
            </div>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-secondary transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm">Средний заряд</span>
              <Icon name="Battery" size={20} className="text-secondary" />
            </div>
            <div className="text-3xl font-bold text-foreground">{avgBattery}%</div>
            <div className="text-xs text-muted-foreground mt-2">Оптимальный уровень</div>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-accent transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm">Пассажиров</span>
              <Icon name="Users" size={20} className="text-accent" />
            </div>
            <div className="text-3xl font-bold text-foreground">{totalPassengers}</div>
            <div className="text-xs text-muted-foreground mt-2">В данный момент</div>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-green-500 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm">Безопасность</span>
              <Icon name="Shield" size={20} className="text-green-500" />
            </div>
            <div className="text-3xl font-bold text-foreground">100%</div>
            <div className="text-xs text-muted-foreground mt-2">Инцидентов: 0</div>
          </Card>
        </div>

        <Tabs defaultValue="monitoring" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-card">
            <TabsTrigger value="monitoring">Мониторинг</TabsTrigger>
            <TabsTrigger value="safety">Безопасность</TabsTrigger>
            <TabsTrigger value="dispatch">Диспетчеризация</TabsTrigger>
            <TabsTrigger value="analytics">Аналитика</TabsTrigger>
          </TabsList>

          <TabsContent value="monitoring" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 p-6 bg-card border-border">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Icon name="Map" size={24} className="mr-2 text-primary" />
                  Карта в реальном времени
                </h2>
                <div className="relative w-full h-[500px] bg-muted rounded-lg overflow-hidden">
                  <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-10">
                    {Array.from({ length: 100 }).map((_, i) => (
                      <div key={i} className="border border-muted-foreground"></div>
                    ))}
                  </div>
                  {vehicles.map(vehicle => (
                    <div
                      key={vehicle.id}
                      className={`absolute w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
                        selectedVehicle === vehicle.id ? 'scale-125 ring-4 ring-primary' : 'scale-100'
                      } ${getStatusColor(vehicle.status)}`}
                      style={{
                        left: `${vehicle.location.x}%`,
                        top: `${vehicle.location.y}%`,
                      }}
                      onClick={() => setSelectedVehicle(vehicle.id === selectedVehicle ? null : vehicle.id)}
                    >
                      <Icon name="Car" size={20} className="text-white" />
                      {vehicle.status === 'active' && (
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-background/90 px-2 py-1 rounded text-xs whitespace-nowrap">
                          {vehicle.speed} км/ч
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 bg-card border-border">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Icon name="List" size={24} className="mr-2 text-secondary" />
                  Список автомобилей
                </h2>
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {vehicles.map(vehicle => (
                    <div
                      key={vehicle.id}
                      className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                        selectedVehicle === vehicle.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-muted-foreground'
                      }`}
                      onClick={() => setSelectedVehicle(vehicle.id === selectedVehicle ? null : vehicle.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-foreground">{vehicle.id}</span>
                        <Badge variant="outline" className={`${getStatusColor(vehicle.status)} text-white border-none`}>
                          {getStatusText(vehicle.status)}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between text-muted-foreground">
                          <span>Заряд:</span>
                          <span className="text-foreground font-medium">{vehicle.battery.toFixed(0)}%</span>
                        </div>
                        {vehicle.status === 'active' && (
                          <>
                            <div className="flex justify-between text-muted-foreground">
                              <span>Скорость:</span>
                              <span className="text-foreground font-medium">{vehicle.speed.toFixed(0)} км/ч</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                              <span>Пассажиров:</span>
                              <span className="text-foreground font-medium">{vehicle.passengers}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="safety" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6 bg-card border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Icon name="ShieldCheck" size={24} className="text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Статус безопасности</h3>
                    <p className="text-xs text-muted-foreground">Все системы в норме</p>
                  </div>
                </div>
                <div className="text-4xl font-bold text-green-500">100%</div>
              </Card>

              <Card className="p-6 bg-card border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Icon name="AlertTriangle" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Предупреждения</h3>
                    <p className="text-xs text-muted-foreground">За последние 24 часа</p>
                  </div>
                </div>
                <div className="text-4xl font-bold text-foreground">0</div>
              </Card>

              <Card className="p-6 bg-card border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center">
                    <Icon name="XCircle" size={24} className="text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Критические события</h3>
                    <p className="text-xs text-muted-foreground">За весь период</p>
                  </div>
                </div>
                <div className="text-4xl font-bold text-foreground">0</div>
              </Card>
            </div>

            <Card className="p-6 bg-card border-border">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Icon name="Activity" size={24} className="mr-2 text-primary" />
                Системы безопасности
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Система предотвращения столкновений', status: 'Активна', icon: 'Shield' },
                  { name: 'Мониторинг слепых зон', status: 'Активна', icon: 'Eye' },
                  { name: 'Адаптивный круиз-контроль', status: 'Активна', icon: 'Gauge' },
                  { name: 'Система удержания полосы', status: 'Активна', icon: 'GitBranch' },
                  { name: 'Автоматическое торможение', status: 'Активна', icon: 'OctagonX' },
                  { name: 'Система распознавания знаков', status: 'Активна', icon: 'Camera' },
                ].map((system, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <Icon name={system.icon as any} size={20} className="text-primary" />
                      <span className="text-sm text-foreground">{system.name}</span>
                    </div>
                    <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/50">
                      {system.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="dispatch" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 bg-card border-border">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Icon name="Clock" size={24} className="mr-2 text-primary" />
                  Активные заказы
                </h3>
                <div className="space-y-3">
                  {vehicles
                    .filter(v => v.status === 'active')
                    .map((vehicle, index) => (
                      <div key={vehicle.id} className="p-4 rounded-lg border border-border hover:border-primary transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-foreground">Заказ #{1000 + index}</span>
                          <Badge variant="outline" className="bg-primary/20 text-primary border-primary/50">
                            В пути
                          </Badge>
                        </div>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between text-muted-foreground">
                            <span>Автомобиль:</span>
                            <span className="text-foreground">{vehicle.id}</span>
                          </div>
                          <div className="flex justify-between text-muted-foreground">
                            <span>Пассажиров:</span>
                            <span className="text-foreground">{vehicle.passengers}</span>
                          </div>
                          <div className="flex justify-between text-muted-foreground">
                            <span>Время в пути:</span>
                            <span className="text-foreground">{Math.floor(Math.random() * 15) + 5} мин</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </Card>

              <Card className="p-6 bg-card border-border">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Icon name="TrendingUp" size={24} className="mr-2 text-secondary" />
                  Эффективность флота
                </h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Загруженность флота</span>
                      <span className="text-lg font-bold text-foreground">
                        {Math.round((activeVehicles / totalVehicles) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(activeVehicles / totalVehicles) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-muted">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Средняя скорость</span>
                      <span className="text-lg font-bold text-foreground">
                        {Math.round(
                          vehicles
                            .filter(v => v.status === 'active')
                            .reduce((acc, v) => acc + v.speed, 0) / activeVehicles
                        )}{' '}
                        км/ч
                      </span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2">
                      <div
                        className="bg-secondary h-2 rounded-full transition-all duration-500"
                        style={{ width: '70%' }}
                      ></div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-muted">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Заполняемость</span>
                      <span className="text-lg font-bold text-foreground">
                        {Math.round((totalPassengers / (activeVehicles * 4)) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2">
                      <div
                        className="bg-accent h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(totalPassengers / (activeVehicles * 4)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6 bg-card border-border">
                <h4 className="text-sm text-muted-foreground mb-2">Поездок сегодня</h4>
                <div className="text-3xl font-bold text-foreground mb-1">247</div>
                <div className="flex items-center text-xs text-green-500">
                  <Icon name="TrendingUp" size={14} className="mr-1" />
                  +12% к вчера
                </div>
              </Card>

              <Card className="p-6 bg-card border-border">
                <h4 className="text-sm text-muted-foreground mb-2">Средняя поездка</h4>
                <div className="text-3xl font-bold text-foreground mb-1">8.4 км</div>
                <div className="flex items-center text-xs text-green-500">
                  <Icon name="TrendingUp" size={14} className="mr-1" />
                  +5% к вчера
                </div>
              </Card>

              <Card className="p-6 bg-card border-border">
                <h4 className="text-sm text-muted-foreground mb-2">Время ожидания</h4>
                <div className="text-3xl font-bold text-foreground mb-1">2.3 мин</div>
                <div className="flex items-center text-xs text-green-500">
                  <Icon name="TrendingDown" size={14} className="mr-1" />
                  -8% к вчера
                </div>
              </Card>
            </div>

            <Card className="p-6 bg-card border-border">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Icon name="BarChart3" size={24} className="mr-2 text-primary" />
                Статистика использования
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Пиковая загрузка (08:00-10:00)</span>
                    <span className="text-sm font-semibold text-foreground">95%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div className="bg-primary h-3 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Дневная загрузка (12:00-18:00)</span>
                    <span className="text-sm font-semibold text-foreground">72%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div className="bg-secondary h-3 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Вечерняя загрузка (18:00-22:00)</span>
                    <span className="text-sm font-semibold text-foreground">88%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div className="bg-accent h-3 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Ночная загрузка (22:00-06:00)</span>
                    <span className="text-sm font-semibold text-foreground">34%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full" style={{ width: '34%' }}></div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 bg-card border-border">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Icon name="Target" size={24} className="mr-2 text-secondary" />
                  Достижения целей
                </h3>
                <div className="space-y-4">
                  {[
                    { goal: 'Снижение ДТП', current: 92, target: 90, color: 'bg-green-500' },
                    { goal: 'Эффективность маршрутов', current: 87, target: 85, color: 'bg-primary' },
                    { goal: 'Удовлетворенность клиентов', current: 4.8, target: 4.5, color: 'bg-secondary', max: 5 },
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">{item.goal}</span>
                        <span className="text-sm font-semibold text-foreground">
                          {item.current}
                          {item.max ? `/${item.max}` : '%'}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`${item.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${(item.current / (item.max || 100)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 bg-card border-border">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Icon name="Zap" size={24} className="mr-2 text-accent" />
                  Энергоэффективность
                </h3>
                <div className="space-y-4">
                  <div className="text-center p-6 rounded-lg bg-muted">
                    <div className="text-5xl font-bold text-foreground mb-2">-45%</div>
                    <div className="text-sm text-muted-foreground">
                      Снижение энергопотребления vs традиционное такси
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border border-border text-center">
                      <div className="text-2xl font-bold text-primary mb-1">2.3 т</div>
                      <div className="text-xs text-muted-foreground">CO₂ сэкономлено в месяц</div>
                    </div>
                    <div className="p-4 rounded-lg border border-border text-center">
                      <div className="text-2xl font-bold text-secondary mb-1">98%</div>
                      <div className="text-xs text-muted-foreground">Использование зеленой энергии</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;