from datetime import datetime

live_packets = []

alerted_ips = set()
ip_packet_counts = {}
logged_events = set()

protocol_stats = {
    "tcp": 0,
    "udp": 0,
    "icmp": 0,
    "other": 0
}

live_stats = {
    "total_packets": 0,
    "safe": 0,
    "medium": 0,
    "high": 0
}

ip_counts = {}

threat_counts = {}

threat_events = []

message_counts = {}


def add_packet(packet):

    live_packets.append(packet)

    live_stats["total_packets"] += 1

    source = packet["source"]
    message = packet["message"]

    # Track message categories
    if message not in message_counts:
        message_counts[message] = 0

    message_counts[message] += 1

    # Log Medium and High threats only once
    if packet["risk"] in ["Medium", "High"]:

        event_key = (
            source,
            message
        )

        if event_key not in logged_events:

            logged_events.add(event_key)

            threat_events.insert(
                0,
                {
                    "time": datetime.now().strftime("%I:%M:%S %p"),
                    "ip": source,
                    "risk": packet["risk"].upper(),
                    "message": message
                }
            )

            if len(threat_events) > 20:
                threat_events.pop()

    # Risk Statistics
    if packet["risk"] == "Safe":

        live_stats["safe"] += 1

    elif packet["risk"] == "Medium":

        live_stats["medium"] += 1

        if source not in threat_counts:
            threat_counts[source] = 0

        threat_counts[source] += 1

    elif packet["risk"] == "High":

        live_stats["high"] += 1

        if source not in threat_counts:
            threat_counts[source] = 0

        threat_counts[source] += 1

    # Packet count per IP
    if source not in ip_packet_counts:
        ip_packet_counts[source] = 0

    ip_packet_counts[source] += 1

    # Protocol Statistics
    protocol = packet["protocol"]

    if protocol == "TCP":
        protocol_stats["tcp"] += 1

    elif protocol == "UDP":
        protocol_stats["udp"] += 1

    elif protocol == "ICMP":
        protocol_stats["icmp"] += 1

    else:
        protocol_stats["other"] += 1

    # Active IP Tracking
    if source not in ip_counts:
        ip_counts[source] = 0

    ip_counts[source] += 1

    # Keep latest 100 packets only
    if len(live_packets) > 100:
        live_packets.pop(0)


def get_packets():
    return live_packets


def get_stats():
    return live_stats


def get_protocol_stats():
    return protocol_stats


def get_top_ips():

    sorted_ips = sorted(
        ip_counts.items(),
        key=lambda x: x[1],
        reverse=True
    )

    return [
        {
            "ip": ip,
            "count": count
        }
        for ip, count in sorted_ips[:10]
    ]


def get_top_threats():

    sorted_threats = sorted(
        threat_counts.items(),
        key=lambda x: x[1],
        reverse=True
    )

    return [
        {
            "ip": ip,
            "count": count
        }
        for ip, count in sorted_threats[:10]
    ]


def get_threat_feed():
    return threat_events


def get_attack_distribution():

    threat_data = []

    for attack_type, count in message_counts.items():

        if attack_type not in [
            "HTTPS Traffic",
            "HTTP Traffic",
            "DNS Traffic",
            "Normal Traffic"
        ]:

            threat_data.append(
                {
                    "type": attack_type,
                    "count": count
                }
            )

    return threat_data