import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Youtube, Tiktok, Instagram, Music, Clock, Calendar, TrendingUp, Users, Eye, Share2, Heart, MessageSquare, Save, List, Settings, ChevronDown, ChevronUp, Zap, Activity } from 'lucide-react';

// --- Data Simulation and Fetching Logic ---

const generateTimeSeriesData = (days, startValue, platform) => {
  const data = [];
  let currentValue = startValue;
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - days + i);
    const dateString = date.toISOString().split('T')[0];

    // Simulate growth with random fluctuations
    const growthFactor = 1 + (Math.random() - 0.5) * 0.1;
    currentValue = Math.round(currentValue * growthFactor);

    // Simulate a spike on a random day (e.g., a new post)
    if (i === Math.floor(days / 2) || i === days - 5) {
      currentValue = Math.round(currentValue * 1.5);
    }

    const entry = {
      date: dateString,
      [platform]: currentValue,
    };
    data.push(entry);
  }
  return data;
};

const initialData = {
  youtube: generateTimeSeriesData(90, 100000, 'youtube'),
  tiktok: generateTimeSeriesData(90, 50000, 'tiktok'),
  instagram: generateTimeSeriesData(90, 75000, 'instagram'),
  music: generateTimeSeriesData(90, 20000, 'music'),
};

const initialMetrics = {
  youtube: { subs: 120000, views: 5000000, watchTime: 150000, comments: 1200 },
  tiktok: { followers: 80000, views: 10000000, likes: 1500000, shares: 50000, saves: 20000, comments: 800 },
  instagram: { followers: 95000, reach: 400000, likes: 80000, comments: 500, follows: 1000 },
  music: { streams: 300000, listeners: 50000, saves: 10000, playlistAdds: 500 },
};

const fetchData = async (platform, timeRange) => {
  // In a real application, this is where you would fetch data from your backend/API.
  // The structure below is "API-Ready" for real implementation.

  if (platform === 'youtube' && process.env.YOUTUBE_API_KEY) {
    // REAL YOUTUBE INTEGRATION (Requires API Key and Channel ID)
    // const response = await fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=statistics&id=${process.env.YOUTUBE_CHANNEL_ID}&key=${process.env.YOUTUBE_API_KEY}`);
    // const data = await response.json();
    // return {
    //   subs: data.items[0].statistics.subscriberCount,
    //   views: data.items[0].statistics.viewCount,
    //   // Time series data would require more complex API calls
    // };
  }

  // SIMULATION LOGIC (Fallback)
  const days = timeRange === '7D' ? 7 : timeRange === '30D' ? 30 : 90;
  const startValue = initialMetrics[platform].followers || initialMetrics[platform].subs || initialMetrics[platform].streams;
  const timeSeries = generateTimeSeriesData(days, startValue, platform);

  return {
    metrics: initialMetrics[platform],
    timeSeries: timeSeries,
  };
};

// --- Best Time to Post Logic ---

const generateBestTimeToPostData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const data = [];

  days.forEach(day => {
    hours.forEach(hour => {
      let engagement = Math.floor(Math.random() * 100);

      // Simulate higher engagement during evenings (18-22) and weekends
      if (hour >= 18 && hour <= 22) {
        engagement += 50;
      }
      if (day === 'Sat' || day === 'Sun') {
        engagement += 30;
      }

      // Clamp the value
      engagement = Math.min(100, engagement);

      data.push({
        day,
        hour,
        engagement,
        tooltip: `Engagement: ${engagement}%`,
      });
    });
  });

  return data;
};

// --- Components ---

const Card = ({ icon: Icon, title, value, growth }) => (
  <div className="bg-gray-800 p-4 rounded-xl shadow-lg flex flex-col">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium text-gray-400">{title}</h3>
      <Icon className="w-5 h-5 text-indigo-400" />
    </div>
    <div className="mt-1 flex items-end justify-between">
      <p className="text-3xl font-bold text-white">{value.toLocaleString()}</p>
      <div className={`text-sm font-semibold flex items-center ${growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
        <TrendingUp className={`w-4 h-4 mr-1 ${growth < 0 ? 'transform rotate-180' : ''}`} />
        {Math.abs(growth)}%
      </div>
    </div>
  </div>
);

const TimeRangeSelector = ({ timeRange, setTimeRange }) => (
  <div className="flex space-x-2 bg-gray-700 p-1 rounded-lg">
    {['7D', '30D', '90D'].map(range => (
      <button
        key={range}
        onClick={() => setTimeRange(range)}
        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
          timeRange === range ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-600'
        }`}
      >
        {range}
      </button>
    ))}
  </div>
);

const HeatmapCell = ({ engagement, day, hour }) => {
  const color = engagement > 80 ? 'bg-red-600' : engagement > 60 ? 'bg-orange-500' : engagement > 40 ? 'bg-yellow-400' : engagement > 20 ? 'bg-green-500' : 'bg-gray-700';
  const tooltipText = `${day} ${hour}:00 - ${hour + 1}:00 | Engagement: ${engagement}%`;

  return (
    <div
      className={`w-full h-full rounded-sm transition-colors duration-200 ${color}`}
      title={tooltipText}
    ></div>
  );
};

const BestTimeToPost = () => {
  const heatmapData = useMemo(() => generateBestTimeToPostData(), []);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
        <Clock className="w-5 h-5 mr-2 text-indigo-400" /> Best Time to Post
      </h2>
      <p className="text-gray-400 mb-4">Simulated audience activity heatmap to find optimal posting times.</p>

      <div className="grid grid-cols-25 gap-1 text-xs text-gray-400">
        {/* Corner and Hour Labels */}
        <div className="col-span-1 row-span-1"></div>
        {hours.map(hour => (
          <div key={hour} className="text-center font-medium">
            {hour % 3 === 0 ? `${hour}:00` : ''}
          </div>
        ))}

        {/* Day Labels and Heatmap Cells */}
        {days.map(day => (
          <React.Fragment key={day}>
            <div className="col-span-1 text-right pr-2 font-medium text-white">{day}</div>
            {hours.map(hour => {
              const cellData = heatmapData.find(d => d.day === day && d.hour === hour);
              return (
                <div key={`${day}-${hour}`} className="col-span-1 h-6">
                  <HeatmapCell engagement={cellData.engagement} day={day} hour={hour} />
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const Overview = ({ data, timeRange }) => {
  const totalFollowers = data.youtube.metrics.subs + data.tiktok.metrics.followers + data.instagram.metrics.followers;
  const totalViews = data.youtube.metrics.views + data.tiktok.metrics.views + data.instagram.metrics.reach + data.music.metrics.streams;

  const combinedTimeSeries = useMemo(() => {
    const map = new Map();
    const platforms = ['youtube', 'tiktok', 'instagram', 'music'];

    platforms.forEach(platform => {
      data[platform].timeSeries.forEach(item => {
        const existing = map.get(item.date) || { date: item.date };
        map.set(item.date, { ...existing, ...item });
      });
    });

    return Array.from(map.values()).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card icon={Users} title="Total Audience" value={totalFollowers} growth={12} />
        <Card icon={Eye} title="Total Impressions" value={totalViews} growth={-3} />
        <Card icon={Heart} title="Total Engagement" value={data.tiktok.metrics.likes + data.instagram.metrics.likes} growth={25} />
        <Card icon={Music} title="Total Streams" value={data.music.metrics.streams} growth={8} />
      </div>

      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">Growth Over Time ({timeRange})</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={combinedTimeSeries} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorYoutube" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF0000" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#FF0000" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorTiktok" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#69C9D0" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#69C9D0" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorInstagram" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E1306C" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#E1306C" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMusic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1DB954" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#1DB954" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="youtube" stackId="1" stroke="#FF0000" fillOpacity={1} fill="url(#colorYoutube)" name="YouTube" />
              <Area type="monotone" dataKey="tiktok" stackId="1" stroke="#69C9D0" fillOpacity={1} fill="url(#colorTiktok)" name="TikTok" />
              <Area type="monotone" dataKey="instagram" stackId="1" stroke="#E1306C" fillOpacity={1} fill="url(#colorInstagram)" name="Instagram" />
              <Area type="monotone" dataKey="music" stackId="1" stroke="#1DB954" fillOpacity={1} fill="url(#colorMusic)" name="Music" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <BestTimeToPost />
    </div>
  );
};

const YoutubeDashboard = ({ data, timeRange }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card icon={Users} title="Subscribers" value={data.youtube.metrics.subs} growth={1.5} />
      <Card icon={Eye} title="Total Views" value={data.youtube.metrics.views} growth={0.8} />
      <Card icon={Clock} title="Watch Time (Hours)" value={data.youtube.metrics.watchTime} growth={-0.2} />
      <Card icon={MessageSquare} title="Comments" value={data.youtube.metrics.comments} growth={3.1} />
    </div>

    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Views Over Time ({timeRange})</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.youtube.timeSeries} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
            <YAxis stroke="#9CA3AF" />
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
            <Legend />
            <Line type="monotone" dataKey="youtube" stroke="#FF0000" activeDot={{ r: 8 }} name="Views" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

const TiktokDashboard = ({ data, timeRange }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card icon={Users} title="Followers" value={data.tiktok.metrics.followers} growth={5.2} />
      <Card icon={Eye} title="Total Views" value={data.tiktok.metrics.views} growth={10.1} />
      <Card icon={Heart} title="Likes" value={data.tiktok.metrics.likes} growth={8.5} />
      <Card icon={Share2} title="Shares" value={data.tiktok.metrics.shares} growth={15.0} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">Follower Growth ({timeRange})</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.tiktok.timeSeries} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTiktokArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#69C9D0" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#69C9D0" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="tiktok" stroke="#69C9D0" fillOpacity={1} fill="url(#colorTiktokArea)" name="Followers" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-yellow-400" /> Virality Tracker
        </h2>
        <p className="text-gray-400 mb-4">Views vs. Shares ratio over the last {timeRange}.</p>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.tiktok.timeSeries.map(item => ({
              date: item.date,
              views: item.tiktok * 10, // Simulated views
              shares: item.tiktok * 0.15, // Simulated shares
            }))} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
              <YAxis yAxisId="left" stroke="#9CA3AF" />
              <YAxis yAxisId="right" orientation="right" stroke="#FBBF24" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="views" stroke="#69C9D0" name="Views" />
              <Line yAxisId="right" type="monotone" dataKey="shares" stroke="#FBBF24" name="Shares" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </div>
);

const InstagramDashboard = ({ data, timeRange }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card icon={Users} title="Followers" value={data.instagram.metrics.followers} growth={2.1} />
      <Card icon={Eye} title="Reach" value={data.instagram.metrics.reach} growth={-1.5} />
      <Card icon={Heart} title="Likes" value={data.instagram.metrics.likes} growth={4.0} />
      <Card icon={MessageSquare} title="Comments" value={data.instagram.metrics.comments} growth={6.3} />
    </div>

    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Follower Growth ({timeRange})</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.instagram.timeSeries} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
            <YAxis stroke="#9CA3AF" />
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
            <Legend />
            <Line type="monotone" dataKey="instagram" stroke="#E1306C" activeDot={{ r: 8 }} name="Followers" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

const MusicDashboard = ({ data, timeRange }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card icon={Music} title="Total Streams" value={data.music.metrics.streams} growth={8.0} />
      <Card icon={Users} title="Monthly Listeners" value={data.music.metrics.listeners} growth={5.5} />
      <Card icon={Save} title="Saves" value={data.music.metrics.saves} growth={10.2} />
      <Card icon={List} title="Playlist Adds" value={data.music.metrics.playlistAdds} growth={1.9} />
    </div>

    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Streams Over Time ({timeRange})</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.music.timeSeries} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMusicArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1DB954" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#1DB954" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
            <YAxis stroke="#9CA3AF" />
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
            <Area type="monotone" dataKey="music" stroke="#1DB954" fillOpacity={1} fill="url(#colorMusicArea)" name="Streams" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

const SettingsPanel = () => {
  const [apiKey, setApiKey] = useState('');
  const [channelId, setChannelId] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSave = () => {
    // In a real app, you would save these securely (e.g., to local storage or a backend)
    console.log('API Key Saved:', apiKey);
    console.log('Channel ID Saved:', channelId);
    alert('Settings saved! Restart the app to apply changes.');
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
      <button
        className="w-full flex justify-between items-center text-xl font-semibold text-white mb-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="flex items-center">
          <Settings className="w-5 h-5 mr-2 text-indigo-400" /> API Settings
        </span>
        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-gray-700">
          <p className="text-gray-400">
            Enter your YouTube Data API Key and Channel ID to fetch real-time data.
            For other platforms, you will need to implement a secure backend proxy.
          </p>

          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300">YouTube API Key</label>
            <input
              type="text"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="AIzaSy..."
            />
          </div>

          <div>
            <label htmlFor="channelId" className="block text-sm font-medium text-gray-300">YouTube Channel ID</label>
            <input
              type="text"
              id="channelId"
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="UC..."
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
          >
            Save Settings
          </button>
        </div>
      )}
    </div>
  );
};

const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', name: 'Overview Hub', icon: Activity },
    { id: 'youtube', name: '@CRO_CEO (YouTube)', icon: Youtube },
    { id: 'tiktok', name: '@officialcro_nizz (TikTok)', icon: Tiktok },
    { id: 'instagram', name: '@officialcro_ceo (Instagram)', icon: Instagram },
    { id: 'music', name: 'Music Platforms', icon: Music },
  ];

  return (
    <div className="space-y-2">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`w-full flex items-center p-3 rounded-lg transition-colors ${
            activeTab === tab.id ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <tab.icon className="w-5 h-5 mr-3" />
          <span className="font-medium">{tab.name}</span>
        </button>
      ))}
      <SettingsPanel />
    </div>
  );
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30D');
  const [data, setData] = useState({
    youtube: { metrics: initialMetrics.youtube, timeSeries: initialData.youtube },
    tiktok: { metrics: initialMetrics.tiktok, timeSeries: initialData.tiktok },
    instagram: { metrics: initialMetrics.instagram, timeSeries: initialData.instagram },
    music: { metrics: initialMetrics.music, timeSeries: initialData.music },
  });

  useEffect(() => {
    const loadData = async () => {
      const platforms = ['youtube', 'tiktok', 'instagram', 'music'];
      const newData = {};
      for (const platform of platforms) {
        newData[platform] = await fetchData(platform, timeRange);
      }
      setData(newData);
    };

    loadData();
  }, [timeRange]);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview data={data} timeRange={timeRange} />;
      case 'youtube':
        return <YoutubeDashboard data={data} timeRange={timeRange} />;
      case 'tiktok':
        return <TiktokDashboard data={data} timeRange={timeRange} />;
      case 'instagram':
        return <InstagramDashboard data={data} timeRange={timeRange} />;
      case 'music':
        return <MusicDashboard data={data} timeRange={timeRange} />;
      default:
        return <Overview data={data} timeRange={timeRange} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-400">NIZZ Analytics Dashboard</h1>
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <TimeRangeSelector timeRange={timeRange} setTimeRange={setTimeRange} />
          <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
            <Calendar className="w-5 h-5 text-gray-300" />
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 flex-shrink-0">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </aside>
        <main className="flex-grow">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
