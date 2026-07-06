import { Challenge } from '../types';

export const DEFAULT_CHALLENGES: Challenge[] = [
  {
    id: 101,
    title: "Basic Router Configuration",
    creator: "CiscoFan",
    difficulty: "Easy",
    category: "Routing",
    xpReward: 50,
    estimatedTime: 5,
    rating: 4.8,
    players: 320,
    description: "Learn how to enter an interface, assign a standard IPv4 address, and enable the interface so it can start routing traffic.",
    requiredKnowledge: [
      "Familiarity with Cisco IOS interface commands",
      "IPv4 addressing and subnet masks",
      "Purpose of the 'no shutdown' command"
    ],
    questions: [
      {
        id: "101-1",
        type: "command",
        question: "Enter interface GigabitEthernet0/0, assign the IP address 10.1.1.1 with subnet mask 255.255.255.0, and bring up the interface.",
        explanation: "To configure an interface, enter configuration mode via 'interface GigabitEthernet0/0', set the IP using 'ip address 10.1.1.1 255.255.255.0', and then type 'no shutdown' to enable the link.",
        promptPrefix: "Router(config)#",
        correctAnswer: [
          "interface GigabitEthernet0/0",
          "ip address 10.1.1.1 255.255.255.0",
          "no shutdown"
        ]
      },
      {
        id: "101-2",
        type: "fill_blank",
        question: "Configure the router global hostname to be 'EdgeRouter'.",
        explanation: "The 'hostname <name>' command sets the identifier for the router in global configuration mode.",
        promptPrefix: "Router(config)# hostname ______",
        answer: "EdgeRouter"
      },
      {
        id: "101-3",
        type: "command",
        question: "Configure a banner of the day (MOTD) with the message 'SECURE'.",
        explanation: "Use the banner motd command followed by a delimiting character (like #) to set a security warning message.",
        promptPrefix: "Router(config)#",
        correctAnswer: [
          "banner motd #SECURE#"
        ]
      }
    ]
  },
  {
    id: 102,
    title: "Static Routing Configuration",
    creator: "CLIHero",
    difficulty: "Medium",
    category: "Routing",
    xpReward: 100,
    estimatedTime: 8,
    rating: 4.6,
    players: 210,
    description: "Set up static network paths on a router to forward packets to a distant network through a next-hop gateway router.",
    requiredKnowledge: [
      "Static route syntax: ip route <destination-network> <subnet-mask> <next-hop-ip>",
      "IP routing principles"
    ],
    questions: [
      {
        id: "102-1",
        type: "command",
        question: "Configure a static route to the network 192.168.2.0/24 via the next-hop gateway IP 10.1.1.2.",
        explanation: "The command 'ip route 192.168.2.0 255.255.255.0 10.1.1.2' instructs the router to send all traffic destined for 192.168.2.0/24 to the gateway at 10.1.1.2.",
        promptPrefix: "Router(config)#",
        correctAnswer: [
          "ip route 192.168.2.0 255.255.255.0 10.1.1.2"
        ]
      },
      {
        id: "102-2",
        type: "fill_blank",
        question: "Complete the command to configure a default static route (gateway of last resort) via next-hop IP 10.1.1.2.",
        explanation: "A default static route uses all zeros for both the network and subnet mask: 'ip route 0.0.0.0 0.0.0.0 <next-hop>'.",
        promptPrefix: "Router(config)# ip route 0.0.0.0 0.0.0.0 ______",
        answer: "10.1.1.2"
      }
    ]
  },
  {
    id: 103,
    title: "VLAN Configuration & Port Assignment",
    creator: "PacketWizard",
    difficulty: "Medium",
    category: "Switching",
    xpReward: 120,
    estimatedTime: 10,
    rating: 4.9,
    players: 150,
    description: "Create Virtual Local Area Networks (VLANs) on a switch and assign access ports to separate broadcast domains.",
    requiredKnowledge: [
      "Creating VLANs in global config",
      "Naming VLANs",
      "Assigning ports using access mode"
    ],
    questions: [
      {
        id: "103-1",
        type: "command",
        question: "Create VLAN 10, name it 'Sales', and exit VLAN configuration.",
        explanation: "Type 'vlan 10' to create/enter VLAN 10 config, use 'name Sales' to rename it, and 'exit' to return to global configuration mode.",
        promptPrefix: "Switch(config)#",
        correctAnswer: [
          "vlan 10",
          "name Sales",
          "exit"
        ]
      },
      {
        id: "103-2",
        type: "fill_blank",
        question: "Enter interface FastEthernet0/1 and configure it as an access port.",
        explanation: "To assign a port to a VLAN, first configure its mode as access with 'switchport mode access'.",
        promptPrefix: "Switch(config-if)# switchport mode ______",
        answer: "access"
      },
      {
        id: "103-3",
        type: "command",
        question: "Assign the current access port to VLAN 10.",
        explanation: "Use the command 'switchport access vlan 10' to link this interface to VLAN 10.",
        promptPrefix: "Switch(config-if)#",
        correctAnswer: [
          "switchport access vlan 10"
        ]
      }
    ]
  },
  {
    id: 104,
    title: "OSPF Single Area Routing",
    creator: "NetMaster",
    difficulty: "Hard",
    category: "Routing",
    xpReward: 220,
    estimatedTime: 12,
    rating: 4.7,
    players: 95,
    description: "Configure dynamic routing using Open Shortest Path First (OSPF) to automatically exchange network routes within Area 0.",
    requiredKnowledge: [
      "OSPF process initialization",
      "Network statements with wildcards (inverse masks)",
      "OSPF Areas"
    ],
    questions: [
      {
        id: "104-1",
        type: "command",
        question: "Start OSPF process 10, define network 10.0.0.0/24 as part of Area 0, and exit OSPF configuration mode.",
        explanation: "Run 'router ospf 10' to start the routing engine, then add the network with wildcard mask 0.0.0.255 in area 0: 'network 10.0.0.0 0.0.0.255 area 0', then 'exit'.",
        promptPrefix: "Router(config)#",
        correctAnswer: [
          "router ospf 10",
          "network 10.0.0.0 0.0.0.255 area 0",
          "exit"
        ]
      },
      {
        id: "104-2",
        type: "fill_blank",
        question: "Configure the OSPF Router ID to be '1.1.1.1' inside OSPF router configuration mode.",
        explanation: "The 'router-id <id>' command uniquely identifies the OSPF router inside the network.",
        promptPrefix: "Router(config-router)# router-id ______",
        answer: "1.1.1.1"
      }
    ]
  },
  {
    id: 105,
    title: "BGP Neighbor Establishment",
    creator: "NetworkKing",
    difficulty: "Expert",
    category: "Routing",
    xpReward: 400,
    estimatedTime: 15,
    rating: 4.9,
    players: 45,
    description: "Establish external Border Gateway Protocol (eBGP) peerings between autonomous systems to route international internet traffic.",
    requiredKnowledge: [
      "BGP AS number configurations",
      "Configuring neighbors and remote AS numbers",
      "Entering BGP address families"
    ],
    questions: [
      {
        id: "105-1",
        type: "command",
        question: "Enable BGP autonomous system 65001, configure neighbor 192.168.12.2 with remote AS 65002, and exit router configuration.",
        explanation: "Initialize BGP via 'router bgp 65001', define peer AS via 'neighbor 192.168.12.2 remote-as 65002', then return to global mode using 'exit'.",
        promptPrefix: "Router(config)#",
        correctAnswer: [
          "router bgp 65001",
          "neighbor 192.168.12.2 remote-as 65002",
          "exit"
        ]
      },
      {
        id: "105-2",
        type: "fill_blank",
        question: "Enter address-family for IPv4 unicast inside BGP configuration.",
        explanation: "Inside 'router bgp' mode, type 'address-family ipv4 unicast' to manage IPv4 route parameters.",
        promptPrefix: "Router(config-router)# address-family ______",
        answer: "ipv4 unicast"
      }
    ]
  }
];
