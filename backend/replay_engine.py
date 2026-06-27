import random
import time
from traffic_store import add_packet

LOCAL_IPS = [
    "192.168.1.2",
    "192.168.1.3",
    "192.168.1.4",
    "192.168.1.5",
    "192.168.1.8",
    "192.168.1.10",
    "192.168.1.12",
    "192.168.1.15"
]

PUBLIC_IPS = [
    "8.8.8.8",
    "1.1.1.1",
    "104.18.16.25",
    "172.217.167.78",
    "13.107.42.16",
    "20.50.73.15",
    "34.110.164.207",
    "45.33.21.90",
    "151.101.1.69"
]

SAFE_MESSAGES = [
    ("HTTPS Traffic", 443, "TCP"),
    ("HTTP Traffic", 80, "TCP"),
    ("DNS Traffic", 53, "UDP"),
    ("Normal Traffic", 8080, "TCP")
]

MEDIUM_MESSAGES = [
    ("Port Scan Detected", 445, "TCP"),
    ("High TCP Port Activity", 3389, "TCP"),
    ("High UDP Port Activity", 1900, "UDP")
]

HIGH_MESSAGES = [
    ("SSH Brute Force", 22, "TCP"),
    ("DoS Attack", 80, "TCP"),
    ("Smurf Attack", 0, "ICMP"),
    ("Probe Attack", 21, "TCP"),
    ("Neptune Attack", 80, "TCP")
]


def random_ip():
    return random.choice(LOCAL_IPS)


def random_destination():
    return random.choice(PUBLIC_IPS)


def generate_packet():

    chance = random.random()

    if chance < 0.80:

        msg, port, proto = random.choice(SAFE_MESSAGES)
        risk = "Safe"

    elif chance < 0.95:

        msg, port, proto = random.choice(MEDIUM_MESSAGES)
        risk = "Medium"

    else:

        msg, port, proto = random.choice(HIGH_MESSAGES)
        risk = "High"

    return {
        "source": random_ip(),
        "destination": random_destination(),
        "protocol": proto,
        "destination_port": port,
        "risk": risk,
        "message": msg
    }


def start_replay():

    print("Replay Engine Started")

    while True:

        packet = generate_packet()

        add_packet(packet)

        time.sleep(random.uniform(0.4, 1.2))