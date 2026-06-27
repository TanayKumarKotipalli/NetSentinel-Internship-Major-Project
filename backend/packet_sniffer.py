from scapy.all import sniff
from scapy.layers.inet import IP, TCP, UDP

from traffic_store import add_packet
from traffic_store import live_stats

traffic_data = []


def process_packet(packet):

    if packet.haslayer(IP):

        source = packet[IP].src
        destination = packet[IP].dst

        destination_port = 0

        if packet.haslayer(TCP):
            destination_port = packet[TCP].dport

        elif packet.haslayer(UDP):
            destination_port = packet[UDP].dport

        proto_number = packet[IP].proto

        if proto_number == 6:
            protocol = "TCP"

        elif proto_number == 17:
            protocol = "UDP"

        elif proto_number == 1:
            protocol = "ICMP"

        else:
            protocol = "OTHER"

        risk = "Safe"
        message = "Normal Traffic"

        # High Risk
        if destination_port == 23:
            risk = "High"
            message = "Telnet Connection"

        elif destination_port == 3389:
            risk = "High"
            message = "Remote Desktop Access"

        elif destination_port in [135, 139, 445]:
            risk = "High"
            message = "Windows Network Service"

        # Medium Risk
        elif destination_port == 22:
            risk = "Medium"
            message = "SSH Connection"

        elif destination_port == 21:
            risk = "Medium"
            message = "FTP Traffic"

        elif destination_port == 25:
            risk = "Medium"
            message = "SMTP Mail Traffic"

        elif destination_port > 50000:

            if protocol == "TCP":
                risk = "Medium"
                message = "High TCP Port Activity"

            elif protocol == "UDP":
                risk = "Medium"
                message = "High UDP Port Activity"

            else:
                risk = "Medium"
                message = "High Port Activity"

        # Safe Traffic
        elif destination_port == 53:
            risk = "Safe"
            message = "DNS Traffic"

        elif destination_port == 80:
            risk = "Safe"
            message = "HTTP Traffic"

        elif destination_port == 443:
            risk = "Safe"
            message = "HTTPS Traffic"

        packet_info = {
            "source": source,
            "destination": destination,
            "protocol": protocol,
            "destination_port": destination_port,
            "risk": risk,
            "message": message
        }

        print(packet_info)

        add_packet(packet_info)

        if live_stats["total_packets"] % 100 == 0:
            print(
                f"Captured {live_stats['total_packets']} packets"
            )


def start_sniffer():

    print("Packet sniffer started")

    sniff(
        prn=process_packet,
        store=False
    )