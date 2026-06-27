import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

function App() {
  const [data, setData] = useState(null);
  const [threats, setThreats] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [predictionResult, setPredictionResult] = useState("");
  const [liveTraffic, setLiveTraffic] = useState([]);
  const [liveStats, setLiveStats] = useState(null);
  const [topIps, setTopIps] = useState([]);
  const [protocolStats, setProtocolStats] =
  useState(null);
  const [topThreats, setTopThreats] =
  useState([]);
  const [threatFeed, setThreatFeed] =
  useState([]);
  const [aiVerdict, setAiVerdict] =
  useState("");
  const [threatHistory, setThreatHistory] =
  useState([]);
  const [attackDistribution, setAttackDistribution] =
  useState([]);
  const [lookupIP, setLookupIP] = useState("");
  const [ipInfo, setIpInfo] = useState(null);
  const [riskStatus, setRiskStatus] = useState({
  badge: "🟠 UNKNOWN",
  description: "No Intelligence Available"
});
  const [loadingIP, setLoadingIP] = useState(false);
  const [lookupSuccess, setLookupSuccess] = useState(false);
  const [report, setReport] = useState(null);
  const [lastUpdated, setLastUpdated] = useState("");
  const [copied, setCopied] = useState(false);
  const [aiStatus, setAiStatus] = useState("Monitoring");
const [lastScan, setLastScan] = useState("Never");
const [nextScan, setNextScan] = useState(60);
const [scanDuration, setScanDuration] = useState(0);
const [todayScans, setTodayScans] = useState(0);
const [showToast, setShowToast] = useState(false);
const [trend, setTrend] = useState("Stable");
const [previousHigh, setPreviousHigh] = useState(0);
  const runThreatAnalysis = async () => {

    try {

        setAiStatus("Scanning");

        const start = performance.now();

        const verdictResponse =
            await axios.get(
                "https://netsentinel-backend-q35i.onrender.com/api/ai-verdict"
            );

        const statsResponse =
            await axios.get(
                "https://netsentinel-backend-q35i.onrender.com/api/live-stats"
            );

        setAiVerdict(
            verdictResponse.data.verdict
        );

        const end = performance.now();

        setScanDuration(
            Math.round(end - start)
        );

        const now = new Date();

        setLastScan(
            now.toLocaleTimeString()
        );

        setTodayScans(
            prev => prev + 1
        );

        setShowToast(true);

        setTimeout(() => {

            setShowToast(false);

        },2000);

        const currentHigh =
            statsResponse.data.high;

        if(currentHigh > previousHigh){

            setTrend("Increasing");

        }

        else if(currentHigh < previousHigh){

            setTrend("Decreasing");

        }

        else{

            setTrend("Stable");

        }

        setPreviousHigh(
            currentHigh
        );

        setAiStatus("Monitoring");

    }

    catch(error){

        console.error(error);

        setAiStatus("Offline");

    }

};
  useEffect(() => {
    axios
      .get("https://netsentinel-backend-q35i.onrender.com/api/dashboard")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get("https://netsentinel-backend-q35i.onrender.com/api/threats")
      .then((response) => {
        setThreats(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    axios
  .get("https://netsentinel-backend-q35i.onrender.com/api/analytics")
  .then((response) => {
    setAnalytics(response.data);
  })
  .catch((error) => {
    console.error(error);
  });
  axios
  .get("https://netsentinel-backend-q35i.onrender.com/api/predictions")
  .then((response) => {
    setPredictions(response.data);
  });
const fetchTraffic = () => {
  axios
    .get("https://netsentinel-backend-q35i.onrender.com/api/live-traffic")
    .then((response) => {
      setLiveTraffic(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
    axios
  .get("https://netsentinel-backend-q35i.onrender.com/api/protocol-stats")
  .then((response) => {
    setProtocolStats(response.data);
  });
  axios
  .get("https://netsentinel-backend-q35i.onrender.com/api/top-threats")
  .then((response) => {
    setTopThreats(response.data);
  });
  axios
  .get("https://netsentinel-backend-q35i.onrender.com/api/threat-feed")
  .then((response) => {
    setThreatFeed(response.data);
  });
  axios
  .get(
    "https://netsentinel-backend-q35i.onrender.com/api/threat-history"
  )
  .then((response) => {
    setThreatHistory(response.data);
  });
  axios
  .get(
    "https://netsentinel-backend-q35i.onrender.com/api/attack-distribution"
  )
  .then((response) => {
    setAttackDistribution(response.data);
  });
};

const fetchLiveStats = () => {
  axios
    .get(
      "https://netsentinel-backend-q35i.onrender.com/api/live-threat-stats"
    )
    .then((response) => {
      setLiveStats(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
};

fetchTraffic();
fetchLiveStats();
runThreatAnalysis();

const trafficInterval = setInterval(
  fetchTraffic,
  2000
);
const fetchTopIps = () => {
  axios
    .get("https://netsentinel-backend-q35i.onrender.com/api/top-ips")
    .then((response) => {
      setTopIps(response.data);
    });
};

fetchTopIps();

const ipInterval =
  setInterval(fetchTopIps, 3000);

const statsInterval = setInterval(
  fetchLiveStats,
  2000
);
const aiInterval = setInterval(
    runThreatAnalysis,
    60000
);
const countdown = setInterval(() => {

    setNextScan(prev => {

        if(prev === 1){

            runThreatAnalysis();

            return 60;

        }

        return prev - 1;

    });

},1000);

return () => {
  clearInterval(trafficInterval);
  clearInterval(statsInterval);
  clearInterval(ipInterval);
  clearInterval(aiInterval);
  clearInterval(countdown);
};
axios
  .get("https://netsentinel-backend-q35i.onrender.com/api/top-ips")
  .then((response) => {
    setTopIps(response.data);
  });

  }, []);
 if (
  !data ||
  !analytics ||
  !liveStats
) {
    return <h1>Loading NetSentinel...</h1>;
  }

  const pieData = liveStats
  ? [
      {
        name: "Safe",
        value: liveStats.safe,
      },
      {
        name: "Medium",
        value: liveStats.medium,
      },
      {
        name: "High",
        value: liveStats.high,
      },
    ]
  : [];
  const lookupIPAddress = async () => {

    try {

        setLoadingIP(true);
        setLookupSuccess(false);

        const response = await axios.get(
    `https://netsentinel-backend-q35i.onrender.com/api/ip-lookup/${lookupIP}`
);

        setIpInfo(response.data);
        setLastUpdated(new Date().toLocaleString());
        const isp = (response.data.isp || "").toLowerCase();
const ip = response.data.ip || "";

// First check for private networks
if (
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.")
) {

    setRiskStatus({
        badge: "🔵 INTERNAL",
        description: "Private Network"
    });

}
// Then check trusted providers
else if (
    isp.includes("google") ||
    isp.includes("amazon") ||
    isp.includes("microsoft") ||
    isp.includes("github") ||
    isp.includes("cloudflare")
) {

    setRiskStatus({
        badge: "🟢 TRUSTED",
        description: "Known Cloud Provider"
    });

}
// Everything else
else {

    setRiskStatus({
        badge: "🟠 UNKNOWN",
        description: "Limited Intelligence"
    });

}
        setLoadingIP(false);

        setLookupSuccess(true);

        setTimeout(() => {
            setLookupSuccess(false);
        }, 2000);

    }

    catch (error) {

        console.error(error);

        setLoadingIP(false);

    }

};
const copyIP = () => {

    navigator.clipboard.writeText(ipInfo.ip);

    setCopied(true);

    setTimeout(() => {

        setCopied(false);

    }, 2000);

};
const generateReport = async () => {

  window.open(
    "https://netsentinel-backend-q35i.onrender.com/api/security-report",
    "_blank"
  );

};
const protocolChartData = protocolStats
  ? [
      {
        name: "TCP",
        count: protocolStats.tcp,
      },
      {
        name: "UDP",
        count: protocolStats.udp,
      },
      {
        name: "ICMP",
        count: protocolStats.icmp,
      },
      {
        name: "OTHER",
        count: protocolStats.other,
      },
    ]
  : [];
  return (
    <div
  style={{
    minHeight: "100vh",
    background: "#0f172a",
    color: "white",
    padding: "25px",
    width: "100%",
  }}
>
     <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  }}
>
  <div>
    <h1
      style={{
        margin: 0,
        fontSize: "42px",
      }}
    >
      NetSentinel
    </h1>

    <p
      style={{
        color: "#94a3b8",
        marginTop: "5px",
      }}
    >
      AI-Powered Network Threat Detection Center
    </p>
  </div>

  <div
    style={{
      background: "#22c55e",
      color: "#000",
      padding: "10px 20px",
      borderRadius: "10px",
      fontWeight: "bold",
    }}
  >
      SYSTEM ONLINE
  </div>
</div>

      {/* Dashboard Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
  "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        <Card
          title="Total Traffic"
          value={liveStats.total_packets}
        />

       <Card
  title="Live Packets"
  value={liveStats.total_packets}
/>

<Card
  title="Safe Packets"
  value={liveStats.safe}
/>
<Card
  title="Medium Risk"
  value={liveStats.medium}
/>
      </div>
      {/* Analytics Cards */}
<div
  style={{
    display: "grid",
    gridTemplateColumns:
  "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  }}
>
<Card
  title="High Risk"
  value={liveStats.high}
/>
</div>
<div
  style={{
    marginTop: "25px",
    background: "#1e293b",
    padding: "35px",
    borderRadius: "20px",
    textAlign: "center",
  }}
>
  <div
style={{
display:"flex",
justifyContent:"center",
alignItems:"center",
gap:"15px",
marginBottom:"10px"
}}
>

<h1
style={{
margin:0,
fontSize:"42px",
fontWeight:"700"
}}
>
AI Threat Detection Center
</h1>

<div
style={{
background:"#16A34A",
color:"white",
padding:"6px 14px",
borderRadius:"20px",
fontSize:"13px",
fontWeight:"700",
animation:"pulse 1.5s infinite"
}}
>
🟢 LIVE
</div>

</div>
  <p
    style={{
      color: "#94a3b8",
      marginBottom: "20px",
    }}
  >
    Analyze network traffic using the trained AI model
  </p>

  <button
    onClick={runThreatAnalysis}
    style={{
      padding: "16px 30px",
      background: "#2563eb",
      color: "white",
      border: "none",
      borderRadius: "12px",
      fontSize: "18px",
      cursor: "pointer",
    }}
  >
   🔄 Analyze Now
  </button>
  <div
style={{
display:"grid",
gridTemplateColumns:"repeat(2,minmax(220px,1fr))",
gap:"18px",
marginTop:"30px"
}}
>

<div style={infoCard}>
<h4>🤖 AI Status</h4>

<p style={{fontWeight:"700"}}>

{
aiStatus==="Monitoring"

? "🟢 LIVE MONITORING"

: aiStatus==="Scanning"

? "🟡 ANALYZING..."

: "🔴 OFFLINE"

}

</p>

</div>

<div style={infoCard}>
<h4>🕒 Last Scan</h4>

<p>{lastScan}</p>

</div>

<div style={infoCard}>
<h4>⏳ Next Scan</h4>

<p>{nextScan}s</p>
<div
style={{
height:"8px",
background:"#334155",
borderRadius:"20px",
marginTop:"10px",
overflow:"hidden"
}}
>

<div
style={{
height:"100%",
width:`${((60-nextScan)/60)*100}%`,
background:"#22C55E",
transition:"width 1s linear"
}}
>

</div>

</div>

</div>

<div style={infoCard}>
<h4>⚡ Scan Time</h4>

<p>{scanDuration} ms</p>

</div>

<div style={infoCard}>
<h4>📈 Today's Scans</h4>

<p>{todayScans}</p>

</div>

<div style={infoCard}>
<h4>📊 Threat Trend</h4>

<p>

{
trend==="Increasing"

? "🔺 Increasing"

: trend==="Decreasing"

? "🔻 Decreasing"

: "➖ Stable"

}

</p>

</div>

</div>
<div
style={{
marginTop:"20px",
color:"#22C55E",
fontWeight:"700",
fontSize:"15px"
}}
>

✓ Auto Monitoring Enabled

<br/>

Scanning every 60 seconds

</div>

  {aiVerdict && (
    <div
style={{
marginTop:"40px",
background:
aiVerdict==="CRITICAL"
?"linear-gradient(135deg,#991B1B,#DC2626)"
:
aiVerdict==="SUSPICIOUS"
?"linear-gradient(135deg,#92400E,#F59E0B)"
:
"linear-gradient(135deg,#166534,#22C55E)",

padding:"35px",
borderRadius:"20px",
textAlign:"center",
boxShadow:"0 20px 45px rgba(0,0,0,.35)"
}}
>

<h3
style={{
marginBottom:"15px",
letterSpacing:"2px",
color:"white"
}}
>
AI THREAT VERDICT
</h3>

<h1
style={{
fontSize:"56px",
margin:"10px 0",
color:"white"
}}
>
{aiVerdict}
</h1>

<p
style={{
color:"rgba(255,255,255,.9)"
}}
>
Last Scan • {lastScan}
</p>

</div>
  )}
</div>
<div
  style={{
    marginTop: "30px",
    background: "#1e293b",
    padding: "20px",
    borderRadius: "15px",
  }}
>
  <h2>Live Network Traffic</h2>

  <table
    style={{
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "15px",
    }}
  >
    <thead>
      <tr>
        <th style={tableHeader}>
          Source IP
        </th>

        <th style={tableHeader}>
          Destination IP
        </th>

        <th style={tableHeader}>
          Protocol
        </th>
      </tr>
    </thead>

    <tbody>
      {liveTraffic
        .slice(-15)
        .reverse()
        .map((packet, index) => (
          <tr key={index}>
            <td style={tableCell}>
              {packet.source}
            </td>

            <td style={tableCell}>
              {packet.destination}
            </td>

            <td style={tableCell}>
              {packet.protocol === 6
                ? "TCP"
                : packet.protocol === 17
                ? "UDP"
                : packet.protocol}
            </td>
          </tr>
        ))}
    </tbody>
  </table>
</div>
{/* Live Network Traffic */}


{/* Top Active IP Addresses */}
<div
  style={{
    marginTop: "30px",
    background: "#1e293b",
    padding: "20px",
    borderRadius: "15px",
  }}
>
  <h2>Top Active IP Addresses</h2>

  <table
    style={{
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "15px",
    }}
  >
    <thead>
      <tr>
        <th style={tableHeader}>IP Address</th>
        <th style={tableHeader}>Packet Count</th>
      </tr>
    </thead>

    <tbody>
      {topIps.map((ip, index) => (
        <tr key={index}>
          <td style={tableCell}>{ip.ip}</td>
          <td style={tableCell}>{ip.count}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
<div
  style={{
    marginTop: "30px",
    background: "#1e293b",
    padding: "20px",
    borderRadius: "15px",
  }}
>
  <h2>Top Threat Sources</h2>

  <table
    style={{
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "15px",
    }}
  >
    <thead>
      <tr>
        <th style={tableHeader}>
          Source IP
        </th>

        <th style={tableHeader}>
          Threat Count
        </th>
      </tr>
    </thead>

    <tbody>
      {topThreats.map((item, index) => (
        <tr key={index}>
          <td style={tableCell}>
            {item.ip}
          </td>

          <td style={tableCell}>
            {item.count}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
<div
  style={{
    marginTop: "30px",
    background: "#1e293b",
    padding: "20px",
    borderRadius: "15px",
  }}
>
  <h2>Live Threat Feed</h2>

  {threatFeed.map((event, index) => (
  <div
    key={index}
    style={{
      padding: "10px",
      marginTop: "10px",
      background: "#0f172a",
      borderRadius: "10px",
    }}
  >
    <div>
      <strong>{event.risk}</strong>
    </div>

    <div>{event.ip}</div>

    <div
      style={{
        color: "#94a3b8",
        fontSize: "14px",
        marginTop: "5px",
      }}
    >
      {event.message}
    </div>
  </div>
))}
</div>
<div
  style={{
    marginTop: "30px",
    background: "#1e293b",
    padding: "20px",
    borderRadius: "15px",
    height: "400px",
  }}
>
  <h2>Protocol Distribution</h2>

  <ResponsiveContainer
    width="100%"
    height="90%"
  >
    <BarChart data={protocolChartData}>
      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="name" />

      <YAxis />

      <Tooltip />

      <Bar
        dataKey="count"
        fill="#3b82f6"
      />
    </BarChart>
  </ResponsiveContainer>
</div>
{/* Recent Threats */}
<div
  style={{
    marginTop: "30px",
    background: "#1e293b",
    padding: "20px",
    borderRadius: "15px",
  }}
></div>

      {/* Pie Chart */}
      <div
        style={{
          marginTop: "40px",
          background: "#1e293b",
          padding: "20px",
          borderRadius: "15px",
          height: "450px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
          }}
        >
          Live Risk Distribution
        </h2>

        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              outerRadius={140}
              label
            >
              <Cell fill="#22c55e" />
              <Cell fill="#f59e0b" />
              <Cell fill="#ef4444" />
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    {/* Attack Type Distribution */}
<div
  style={{
    marginTop: "30px",
    background: "#1e293b",
    padding: "20px",
    borderRadius: "15px",
    height: "450px",
  }}
>
  <h2
    style={{
      textAlign: "center",
      marginBottom: "15px",
    }}
  >
    Threat Category Distribution
  </h2>

  <ResponsiveContainer
    width="100%"
    height="90%"
  >
    <BarChart
      data={attackDistribution}
    >
      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="type" />

      <YAxis />

      <Tooltip />

      <Bar
        dataKey="count"
        fill="#3b82f6"
      />
    </BarChart>
  </ResponsiveContainer>
</div>
{/* AI Prediction History */}
<div
  style={{
    marginTop: "30px",
    background: "#1e293b",
    padding: "20px",
    borderRadius: "15px",
  }}
>
  <h2>Recent AI Threat History</h2>

<table
  style={{
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "15px",
  }}
>
  <thead>
    <tr>
      <th style={tableHeader}>Time</th>
      <th style={tableHeader}>IP</th>
      <th style={tableHeader}>Risk</th>
      <th style={tableHeader}>Reason</th>
    </tr>
  </thead>

  <tbody>
    {threatHistory.map((event, index) => (
      <tr key={index}>

        <td style={tableCell}>
          {event.time}
        </td>

        <td style={tableCell}>
          {event.ip}
        </td>

        <td
          style={{
            ...tableCell,
            color:
              event.risk === "HIGH"
                ? "#ef4444"
                : "#f59e0b",
            fontWeight: "bold",
          }}
        >
          {event.risk}
        </td>

        <td style={tableCell}>
          {event.message}
        </td>

      </tr>
    ))}
  </tbody>
</table>
</div>
      {/* Threat Table */}
      <div
        style={{
          marginTop: "30px",
          background: "#1e293b",
          padding: "20px",
          borderRadius: "15px",
        }}
      >
       <div
  style={{
    marginTop: "35px",
    background: "linear-gradient(135deg,#1e293b,#0f172a)",
    padding: "30px",
    borderRadius: "20px",
    border: "1px solid rgba(59,130,246,.35)",
    boxShadow: "0 12px 30px rgba(0,0,0,.35)"
  }}
>

<h2
style={{
fontSize:"28px",
marginBottom:"8px",
fontWeight:"700"
}}
>
🌐 IP Intelligence Lookup
</h2>

<p
style={{
color:"#94a3b8",
lineHeight:"1.7",
marginBottom:"25px"
}}
>
Analyze any public IP address and retrieve
real-time geolocation, ISP information and
network intelligence.
</p>

<div
style={{
display:"flex",
gap:"15px",
marginBottom:"30px"
}}
>

<input
type="text"
placeholder="Enter IP Address (Example: 8.8.8.8)"
value={lookupIP}
onChange={(e)=>setLookupIP(e.target.value)}
style={{
flex:1,
padding:"18px 20px",
background:"#0f172a",
color:"white",
border:"2px solid #334155",
borderRadius:"14px",
fontSize:"17px",
outline:"none",
transition:"all .25s ease",
boxShadow:"0 0 10px rgba(37,99,235,.08)"
}}
onFocus={(e)=>{
e.currentTarget.style.borderColor="#3B82F6";
e.currentTarget.style.boxShadow="0 0 18px rgba(59,130,246,.45)";
}}

onBlur={(e)=>{
e.currentTarget.style.borderColor="#334155";
e.currentTarget.style.boxShadow="0 0 10px rgba(37,99,235,.08)";
}}
/>

<button
onClick={lookupIPAddress}
style={{
padding:"16px 28px",
background:"linear-gradient(90deg,#2563eb,#3b82f6)",
color:"white",
border:"none",
borderRadius:"12px",
cursor:"pointer",
fontWeight:"600",
fontSize:"16px"
}}
>
{
loadingIP
? "🔄 Analyzing..."
: lookupSuccess
? "✅ Intelligence Retrieved"
: "🔍 Analyze IP"
}

</button>

</div>

{
ipInfo && (

<div
style={{
background:"#0f172a",
padding:"25px",
borderRadius:"18px",
border:"1px solid #334155"
}}
>

<div
style={{
marginBottom:"25px"
}}
>

<h2
style={{
margin:"0",
fontSize:"26px",
fontWeight:"700"
}}
>
📡 Network Intelligence Report
</h2>

<p
style={{
marginTop:"8px",
color:"#94a3b8",
fontSize:"15px"
}}
>
Real-Time Geolocation & Threat Analysis
</p>

</div>

<div
style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",
gap:"18px"
}}
>

<div
style={{
...infoCard,
background:"linear-gradient(135deg,#1E3A8A,#2563EB)"
}}
><div
style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center"
}}
>

<div>

<p>🌐 IP Address</p>

<h2>{ipInfo.ip}</h2>

</div>

<button
onClick={copyIP}
style={{
background:"rgba(255,255,255,.15)",
border:"none",
padding:"8px 14px",
borderRadius:"8px",
color:"white",
cursor:"pointer",
fontWeight:"600"
}}
>

{copied ? "✅ Copied" : "📋 Copy"}

</button>

</div>
</div>

<div
style={{
...infoCard,
background:"linear-gradient(135deg,#15803D,#22C55E)"
}}
>
<div style={infoTitle}>🌍 Country</div>
<div style={infoValue}>{ipInfo.country}</div>
</div>

<div
style={{
...infoCard,
background:"linear-gradient(135deg,#6D28D9,#8B5CF6)"
}}
>
<div style={infoTitle}>🏙 City</div>
<div style={infoValue}>{ipInfo.city}</div>
</div>

<div
style={{
...infoCard,
background:"linear-gradient(135deg,#C2410C,#F97316)"
}}
>
<div style={infoTitle}>🏢 ISP</div>
<div style={infoValue}>{ipInfo.isp}</div>
</div>

</div>
<hr
style={{
margin:"30px 0",
borderColor:"#334155"
}}
/>

<div
style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center"
}}
>

<div>

<h3 style={{marginBottom:"6px"}}>
🛡 Risk Intelligence
</h3>

<p
style={{
color:"#94a3b8",
marginBottom:"12px"
}}
>
{riskStatus.description}
</p>

<div
style={{
fontSize:"13px",
color:"#64748B"
}}
>
🕒 Last Updated<br/>
{lastUpdated}
</div>

</div>
<div
style={{
background:
riskStatus.badge.includes("TRUSTED")
? "#16A34A"
: riskStatus.badge.includes("INTERNAL")
? "#2563EB"
: "#EA580C",

padding:"12px 25px",
borderRadius:"25px",
fontWeight:"700",
color:"white"
}}
>
{riskStatus.badge}
</div>

</div>
</div>

)

}

</div>
<div
  style={{
    marginTop: "35px",
    background: "linear-gradient(135deg,#1e293b,#0f172a)",
    padding: "30px",
    borderRadius: "20px",
    border: "1px solid rgba(59,130,246,0.35)",
    boxShadow: "0 12px 30px rgba(0,0,0,0.35)"
  }}
>

<h2
style={{
marginBottom:"8px",
fontSize:"28px",
fontWeight:"700"
}}
>
📄 Security Report Generator
</h2>

<p
style={{
color:"#94a3b8",
marginBottom:"25px",
lineHeight:"1.7"
}}
>
Generate a professional AI-powered security report containing
real-time threat intelligence, AI verdict, protocol analysis,
network statistics and actionable security recommendations.
</p>

<div
style={{
display:"flex",
gap:"15px",
flexWrap:"wrap",
marginBottom:"30px"
}}
>

<div style={{
background:"#0f172a",
padding:"12px 18px",
borderRadius:"10px",
border:"1px solid #334155"
}}>
🛡 AI Verdict
</div>

<div style={{
background:"#0f172a",
padding:"12px 18px",
borderRadius:"10px",
border:"1px solid #334155"
}}>
📊 Network Summary
</div>

<div style={{
background:"#0f172a",
padding:"12px 18px",
borderRadius:"10px",
border:"1px solid #334155"
}}>
🌐 Threat Intelligence
</div>

<div style={{
background:"#0f172a",
padding:"12px 18px",
borderRadius:"10px",
border:"1px solid #334155"
}}>
📄 PDF Export
</div>

</div>

<button
onClick={generateReport}
style={{
padding:"16px 30px",
fontSize:"17px",
fontWeight:"600",
background:"linear-gradient(90deg,#2563eb,#3b82f6)",
color:"white",
border:"none",
borderRadius:"12px",
cursor:"pointer",
boxShadow:"0 10px 25px rgba(37,99,235,.35)",
transition:"all .25s ease"
}}
onMouseOver={(e)=>{
e.currentTarget.style.transform="translateY(-2px)";
e.currentTarget.style.boxShadow="0 15px 30px rgba(37,99,235,.45)";
}}
onMouseOut={(e)=>{
e.currentTarget.style.transform="translateY(0px)";
e.currentTarget.style.boxShadow="0 10px 25px rgba(37,99,235,.35)";
}}
>
⬇ Generate & Download Security Report
</button>

</div>
{
showToast && (

<div
style={{
position:"fixed",
bottom:"35px",
right:"35px",
background:"#16A34A",
padding:"18px 28px",
borderRadius:"12px",
fontWeight:"700",
color:"white",
boxShadow:"0 15px 30px rgba(0,0,0,.35)",
zIndex:9999
}}
>

✅ AI Threat Analysis Updated

</div>

)

}
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div
      style={{
        background: "#1e293b",
        padding: "30px",
        borderRadius: "18px",
        textAlign: "center",
        boxShadow:
          "0 8px 20px rgba(0,0,0,0.25)",
      }}
    >
      <h3
        style={{
          color: "#94a3b8",
          marginBottom: "15px",
        }}
      >
        {title}
      </h3>

      <h1
        style={{
          fontSize: "42px",
          margin: 0,
        }}
      >
        {value}
      </h1>
      {
}
    </div>
  );
}
function SeverityBadge({ severity }) {
  let color = "#22c55e";

  if (severity === "High") {
    color = "#f59e0b";
  }

  if (severity === "Critical") {
    color = "#ef4444";
  }
 
  return (
   
    <span
      style={{
        backgroundColor: color,
        color: "white",
        padding: "6px 12px",
        borderRadius: "8px",
        fontWeight: "bold",
      }}
    >
      {severity}
    </span>
  );
}
const infoCard = {
  background: "#1e293b",
  padding: "20px",
  borderRadius: "14px",
  border: "1px solid #334155"
};

const infoTitle = {
  color: "#94a3b8",
  fontSize: "14px",
  marginBottom: "12px"
};

const infoValue = {
  fontSize: "20px",
  fontWeight: "700"
};
const tableHeader = {
  padding: "12px",
  textAlign: "left",
  borderBottom: "1px solid #334155",
};

const tableCell = {
  padding: "12px",
  borderBottom: "1px solid #334155",
};
export default App;