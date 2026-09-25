# Serge Clicker — volledige spelgids

> **Let op: hier staat alles in, ook alle verborgen dingen.** Wil je zelf zoeken, lees dan niet verder dan het hoofdstuk over de studieboom.

Dit bestand is gemaakt met `node tools/spelgids.mjs` en volgt de spelbestanden. Op dit moment: **22 apparaten**, **154 upgrades**, **128 prestaties** (waarvan 20 verborgen), **66 knooppunten** in de studieboom en **5 onderdelen** in het labo.

## Hoe het spel werkt

Je klikt op Serge en verdient packets. Met packets koop je apparaten die vanzelf packets opleveren, en upgrades die alles versnellen. Hoe verder je komt, hoe meer het spel zichzelf speelt — en hoe meer er opengaat.

De volgorde waarin dingen vrijkomen:

1. **Winkel** — meteen. Klik tot je 15 packets hebt voor je eerste patchkabel.

2. **Upgrades** — zodra je er een verdient (tien kliks geeft de eerste al).

3. **Prestaties** — meteen zichtbaar, ze vullen zich vanzelf.

4. **Labo** — bij 5.000 packets totaal. Daarbinnen gaat elke opdracht apart open.

5. **Studie** — bij 3 miljard packets totaal. Vanaf 31,2 miljard kun je voor het eerst afstuderen.

Sneltoetsen: **spatie** klikt, **1 / 2 / 3 / 4** zetten het aantal per aankoop op 1, 10, 100 of max, en **G** pakt een gouden packet. Het tandwiel rechtsboven opent statistieken, instellingen en opslag.

## De apparaten

Elk volgend exemplaar van hetzelfde apparaat kost 15% meer dan het vorige. De opbrengst hieronder is de basis, vóór upgrades, vakbonus, koffie en studiepunten.

| # | Apparaat | Vak | Eerste prijs | Opbrengst per stuk |
|---|---|---|---|---|
| 1 | 🔌 **Patchkabel** | Netwerken | 15 | 0,1 p/s |
| 2 | 🔀 **Netwerk Switch** | Netwerken | 100 | 1 p/s |
| 3 | 🧭 **Core Router** | Netwerken | 1.100 | 8 p/s |
| 4 | 🧵 **Glasvezel** | Netwerken | 12.000 | 47 p/s |
| 5 | 🗄️ **Serverrack** | Datacenter | 130.000 | 260 p/s |
| 6 | 🏢 **Datacenter** | Datacenter | 1,4 miljoen | 1.400 p/s |
| 7 | 🖥️ **Proxmox Cluster** | Datacenter | 20 miljoen | 7.800 p/s |
| 8 | 🧊 **vSphere Cluster** | Datacenter | 330 miljoen | 44.000 p/s |
| 9 | 🗂️ **Active Directory** | Security | 2,8 miljard | 260.000 p/s |
| 10 | ☸️ **Kubernetes Cluster** | Cloud | 25 miljard | 1,6 miljoen p/s |
| 11 | 🎛️ **SDN Controller** | Datacenter | 230 miljard | 10 miljoen p/s |
| 12 | 🧱 **Next-gen Firewall** | Security | 2,2 biljoen | 65 miljoen p/s |
| 13 | 🛡️ **Security Operations** | Security | 21 biljoen | 430 miljoen p/s |
| 14 | ☁️ **Hyperscaler-regio** | Cloud | 200 biljoen | 2,9 miljard p/s |
| 15 | 🌑 **Dark Fiber Mesh** | Netwerken | 2,1 biljard | 21 miljard p/s |
| 16 | 🌊 **Zeekabel** | Netwerken | 22 biljard | 150 miljard p/s |
| 17 | 🛰️ **Satellietconstellatie** | Netwerken | 230 biljard | 1,1 biljoen p/s |
| 18 | ⚛️ **Quantum Link** | Cloud | 2,6 triljoen | 8,3 biljoen p/s |
| 19 | 🧠 **AI NetOps** | Cloud | 29 triljoen | 64 biljoen p/s |
| 20 | 🌞 **Dyson-datacenter** | Cloud | 330 triljoen | 510 biljoen p/s |
| 21 | 🌌 **Parallel VPN** | Cloud | 3,9 triljard | 4,2 biljard p/s |
| 22 | 🕳️ **Singulariteit** | Cloud | 48 triljard | 35 biljard p/s |

**Vakbonus.** Elk apparaat hoort bij een vak. Elke 25 apparaten binnen één vak geven dat hele vak 2% extra productie. De vier vakken: 🔀 Netwerken, 🏢 Datacenter, ☁️ Cloud, 🛡️ Security.

## De upgrades

In totaal 154 stuks. Ze verschijnen vanzelf in het tabblad zodra je aan de voorwaarde voldoet, en blijven staan tot je ze koopt.

| Soort | Aantal | Wat het doet |
|---|---|---|
| Apparaat | 110 | Verdubbelt de opbrengst van één apparaat |
| Klikken | 12 | Meer packets per klik |
| Gouden packets | 8 | Vaker, langer of sterker |
| Assistenten | 6 | Productie stijgt mee met je prestaties |
| Synergie | 10 | Het ene apparaat maakt het andere beter |
| Specialisatie | 4 | Verdubbelt een heel vak |
| Studie | 4 | Alleen na je eerste diploma |

### Apparaat-upgrades

Elk apparaat heeft er vijf. Ze komen vrij bij 1, 5, 25, 50, 100 exemplaren en kosten respectievelijk 10x, 100x, 1000x, 15000x, 200000x de basisprijs van dat apparaat. Elke upgrade verdubbelt de opbrengst van dat apparaat.

**🔌 Patchkabel**

1. *Ontklitte kabelbak* — bij 1 stuks, 150 packets. Iemand heeft de bak eindelijk uitgezocht.

2. *Kleurcodering* — bij 5 stuks, 1.500 packets. T568B. Niet T568A. Serge kijkt mee.

3. *Kabelgoot* — bij 25 stuks, 15.000 packets. Alles weggewerkt, niets hangt meer los.

4. *Cat6a* — bij 50 stuks, 225.000 packets. Meer koper, minder crosstalk, zwaardere rol.

5. *Gecertificeerde krimptang* — bij 100 stuks, 3 miljoen packets. Elke stekker zit in één keer goed.

**🔀 Netwerk Switch**

1. *Jumbo frames* — bij 1 stuks, 1.000 packets. 9000 bytes per frame. Minder overhead, meer doorvoer.

2. *VLAN-indeling* — bij 5 stuks, 10.000 packets. Eindelijk staat de printer niet meer bij de servers.

3. *Spanning Tree* — bij 25 stuks, 100.000 packets. Geen loops meer. De broadcast storm van vorig jaar is vergeven.

4. *PoE+* — bij 50 stuks, 1,5 miljoen packets. De access points hebben geen stopcontact meer nodig.

5. *Stacking* — bij 100 stuks, 20 miljoen packets. Acht switches, één beheeradres.

**🧭 Core Router**

1. *Statische routes* — bij 1 stuks, 11.000 packets. Werkt prima tot er iets verandert.

2. *OSPF* — bij 5 stuks, 110.000 packets. Area 0 en verder alles netjes eronder.

3. *BGP-sessie* — bij 25 stuks, 1,1 miljoen packets. Je eigen AS-nummer. Serge is trots.

4. *Hardware forwarding* — bij 50 stuks, 16,5 miljoen packets. Routeren gebeurt nu in silicium, niet in software.

5. *Redundante supervisors* — bij 100 stuks, 220 miljoen packets. De ene faalt, de andere merkt het amper.

**🧵 Glasvezel**

1. *Single-mode* — bij 1 stuks, 120.000 packets. Eén lichtpad, veel verder dan multimode.

2. *Fusielassen* — bij 5 stuks, 1,2 miljoen packets. Geen connectorverlies meer op de tussenpunten.

3. *DWDM* — bij 25 stuks, 12 miljoen packets. Tachtig kleuren licht door dezelfde vezel.

4. *400G-optiek* — bij 50 stuks, 180 miljoen packets. De transceiver kost meer dan de switch.

5. *Geharnaste mantel* — bij 100 stuks, 2,4 miljard packets. Bestand tegen knaagdieren en tegen stagiairs.

**🗄️ Serverrack**

1. *Blindplaten* — bij 1 stuks, 1,3 miljoen packets. De koude lucht gaat waar hij hoort.

2. *Warme- en koudegangopstelling* — bij 5 stuks, 13 miljoen packets. Scheelt de helft aan koeling.

3. *Redundante PDU's* — bij 25 stuks, 130 miljoen packets. Twee voedingspaden per apparaat.

4. *Kabelmanagement-armen* — bij 50 stuks, 1,95 miljard packets. Uitschuiven zonder iets los te trekken.

5. *Directe vloeistofkoeling* — bij 100 stuks, 26 miljard packets. Water in een rack. Het went.

**🏢 Datacenter**

1. *N+1 UPS* — bij 1 stuks, 14 miljoen packets. De stroom hapert, de servers merken het niet.

2. *Dieselgenerator* — bij 5 stuks, 140 miljoen packets. Getest op de eerste maandag van de maand.

3. *Containment* — bij 25 stuks, 1,4 miljard packets. Warme lucht komt nergens meer waar hij niet hoort.

4. *Vrije koeling* — bij 50 stuks, 21 miljard packets. Negen maanden per jaar koelt het weer je datacenter.

5. *Tier IV* — bij 100 stuks, 280 miljard packets. Alles dubbel. Ook de dingen die al dubbel waren.

**🖥️ Proxmox Cluster**

1. *ZFS-pool* — bij 1 stuks, 200 miljoen packets. Snapshots die niets kosten tot je ze gebruikt.

2. *Live migration* — bij 5 stuks, 2 miljard packets. De VM verhuist terwijl hij draait.

3. *Ceph* — bij 25 stuks, 20 miljard packets. Opslag zonder SAN, mits je genoeg nodes hebt.

4. *HA-groepen* — bij 50 stuks, 300 miljard packets. Node valt om, VM staat elders alweer op.

5. *Backup-server* — bij 100 stuks, 4 biljoen packets. Het enige onderdeel dat je écht nooit mag missen.

**🧊 vSphere Cluster**

1. *DRS* — bij 1 stuks, 3,3 miljard packets. De cluster verdeelt zichzelf terwijl je toekijkt.

2. *vSAN* — bij 5 stuks, 33 miljard packets. De schijven in de hosts zijn nu de opslag.

3. *NSX-overlay* — bij 25 stuks, 330 miljard packets. Netwerken bestaan alleen nog in software.

4. *Fault tolerance* — bij 50 stuks, 4,95 biljoen packets. Twee identieke VM's, één schaduw.

5. *vCenter HA* — bij 100 stuks, 66 biljoen packets. Zelfs het beheer heeft nu een reserve.

**🗂️ Active Directory**

1. *Group Policy* — bij 1 stuks, 28 miljard packets. Achtergrondfoto's centraal geregeld, macht compleet.

2. *Read-only domeincontroller* — bij 5 stuks, 280 miljard packets. Voor de locatie die je niet vertrouwt.

3. *Kerberos-hardening* — bij 25 stuks, 2,8 biljoen packets. Tickets die niemand meer namaakt.

4. *Tiered admin-model* — bij 50 stuks, 42 biljoen packets. Domain admins loggen nergens anders meer op in.

5. *Multi-forest trust* — bij 100 stuks, 560 biljoen packets. Twee bedrijven, één inlog, nul rust.

**☸️ Kubernetes Cluster**

1. *Helm-charts* — bij 1 stuks, 250 miljard packets. Eén commando, dertig YAML-bestanden minder.

2. *Autoscaler* — bij 5 stuks, 2,5 biljoen packets. Pods erbij als het druk is, eraf als niemand kijkt.

3. *Service mesh* — bij 25 stuks, 25 biljoen packets. Elk pakketje krijgt onderweg een stempel.

4. *Operators* — bij 50 stuks, 375 biljoen packets. De cluster beheert nu z'n eigen databases.

5. *Federatie* — bij 100 stuks, 5 biljard packets. Vijf clusters die doen alsof ze er één zijn.

**🎛️ SDN Controller**

1. *OpenFlow* — bij 1 stuks, 2,3 biljoen packets. Flows worden neergelegd, niet geleerd.

2. *Intent-based beleid* — bij 5 stuks, 23 biljoen packets. Je zegt wat je wilt, niet hoe.

3. *Telemetrie* — bij 25 stuks, 230 biljoen packets. Elke poort vertelt tien keer per seconde hoe het gaat.

4. *Zero-touch provisioning* — bij 50 stuks, 3,45 biljard packets. Uitpakken, inpluggen, klaar.

5. *Digitale tweeling* — bij 100 stuks, 46 biljard packets. Elke wijziging draait eerst in een kopie van je netwerk.

**🧱 Next-gen Firewall**

1. *Deep packet inspection* — bij 1 stuks, 22 biljoen packets. Hij leest mee. Voor je eigen bestwil.

2. *IPS-signatures* — bij 5 stuks, 220 biljoen packets. Bekende aanvallen halen de logregel niet eens.

3. *TLS-inspectie* — bij 25 stuks, 2,2 biljard packets. Versleuteld verkeer is niet langer een blinde vlek.

4. *Geo-blocking* — bij 50 stuks, 33 biljard packets. Halve wereldkaart uit, klachten binnen een dag.

5. *Cluster met sessiesync* — bij 100 stuks, 440 biljard packets. Failover zonder één verbroken sessie.

**🛡️ Security Operations**

1. *SIEM-correlatie* — bij 1 stuks, 210 biljoen packets. Duizend losse logs worden één verhaal.

2. *Threat intel* — bij 5 stuks, 2,1 biljard packets. Je weet wat er komt voor het aankomt.

3. *Playbooks* — bij 25 stuks, 21 biljard packets. De eerste vijf stappen doet niemand meer met de hand.

4. *Threat hunting* — bij 50 stuks, 315 biljard packets. Zoeken naar wat geen alarm heeft afgegeven.

5. *24/7-bezetting* — bij 100 stuks, 4,2 triljoen packets. Ook om 03:00 kijkt er iemand mee.

**☁️ Hyperscaler-regio**

1. *Reserved instances* — bij 1 stuks, 2 biljard packets. Drie jaar vastleggen, veertig procent goedkoper.

2. *Edge-locaties* — bij 5 stuks, 20 biljard packets. De inhoud staat al in de stad van je gebruiker.

3. *Eigen silicium* — bij 25 stuks, 200 biljard packets. Chips die alleen jij mag kopen.

4. *Extra zone* — bij 50 stuks, 3 triljoen packets. Nog een gebouw dat tegelijk mag omvallen. Of niet.

5. *Eigen zeekabel* — bij 100 stuks, 40 triljoen packets. Waarom huren als je kunt graven.

**🌑 Dark Fiber Mesh**

1. *Eigen golflengtes* — bij 1 stuks, 21 biljard packets. Geen provider meer tussen jou en het licht.

2. *Ringtopologie* — bij 5 stuks, 210 biljard packets. Kabel doorgesneden? Het verkeer gaat linksom.

3. *Ultralaag-latentiepad* — bij 25 stuks, 2,1 triljoen packets. Recht door, ook als dat duurder graven is.

4. *Verzegelde lasmoffen* — bij 50 stuks, 31,5 triljoen packets. Grondwater komt er niet meer bij.

5. *Landelijke mesh* — bij 100 stuks, 420 triljoen packets. Elke stad hangt aan drie andere.

**🌊 Zeekabel**

1. *Repeaters* — bij 1 stuks, 220 biljard packets. Om de tachtig kilometer krijgt het licht een duw.

2. *Haaibestendige mantel* — bij 5 stuks, 2,2 triljoen packets. Getest. Meerdere keren. Onvrijwillig.

3. *Kabelschip op standby* — bij 25 stuks, 22 triljoen packets. Breuk op dinsdag, vaart uit op dinsdag.

4. *Landingsstations* — bij 50 stuks, 330 triljoen packets. Twee bunkers aan zee, allebei zwaarbewaakt.

5. *Trans-Pacifisch pad* — bij 100 stuks, 4,4 triljard packets. Achttienduizend kilometer in één stuk.

**🛰️ Satellietconstellatie**

1. *Lage baan* — bij 1 stuks, 2,3 triljoen packets. Vijfhonderd kilometer in plaats van vijfendertigduizend.

2. *Laserlinks* — bij 5 stuks, 23 triljoen packets. Satellieten praten onderling, zonder grond.

3. *Fasegestuurde antennes* — bij 25 stuks, 230 triljoen packets. Geen schotel die moet meedraaien.

4. *Grondstationnetwerk* — bij 50 stuks, 3,45 triljard packets. Overal een landingspunt binnen bereik.

5. *Polaire banen* — bij 100 stuks, 46 triljard packets. Ook Antarctica heeft nu ping.

**⚛️ Quantum Link**

1. *Kwantumrepeaters* — bij 1 stuks, 26 triljoen packets. Verstrengeling die een continent overleeft.

2. *Sleuteldistributie* — bij 5 stuks, 260 triljoen packets. Meeluisteren verandert de sleutel. Handig.

3. *Foutcorrectie* — bij 25 stuks, 2,6 triljard packets. Duizend fysieke qubits voor één die klopt.

4. *Verstrengelingsfabriek* — bij 50 stuks, 39 triljard packets. Paren op bestelling, per seconde.

5. *Planetaire backbone* — bij 100 stuks, 520 triljard packets. De hele planeet, één kwantumnetwerk.

**🧠 AI NetOps**

1. *Zelflerende routering* — bij 1 stuks, 290 triljoen packets. Het pad van gisteren was niet het beste pad.

2. *Voorspellend onderhoud* — bij 5 stuks, 2,9 triljard packets. De schijf wordt vervangen voor hij stukgaat.

3. *Autonome incidentafhandeling* — bij 25 stuks, 29 triljard packets. Storing om 02:00, oplossing om 02:01.

4. *Digitale collega* — bij 50 stuks, 435 triljard packets. Praat mee in de stand-up, klaagt nooit.

5. *Eigen mening* — bij 100 stuks, 5,8 quadriljoen packets. Hij is het niet altijd eens met je ontwerp. Hij heeft vaak gelijk.

**🌞 Dyson-datacenter**

1. *Zonneschil* — bij 1 stuks, 3,3 triljard packets. Een procent van de ster, volledig benut.

2. *Kunstmatige nacht* — bij 5 stuks, 33 triljard packets. De warmte moet érgens heen.

3. *Sterkernkoeling* — bij 25 stuks, 330 triljard packets. Koelen met iets wat kouder is dan de ruimte.

4. *Miljard collectoren* — bij 50 stuks, 4,95 quadriljoen packets. De zwerm is vanaf de aarde zichtbaar.

5. *Tweede ster* — bij 100 stuks, 66 quadriljoen packets. Eén ster bleek niet genoeg voor de logbestanden.

**🌌 Parallel VPN**

1. *Dimensionale peering* — bij 1 stuks, 39 triljard packets. Gratis verkeer met de buuruniversa.

2. *Anycast over werelden* — bij 5 stuks, 390 triljard packets. Het dichtstbijzijnde universum antwoordt.

3. *Paradoxpreventie* — bij 25 stuks, 3,9 quadriljoen packets. Je eigen packet mag je niet meer tegenkomen.

4. *Universum-load-balancer* — bij 50 stuks, 58,5 quadriljoen packets. Drukke werkelijkheden worden ontzien.

5. *Eigen tak* — bij 100 stuks, 780 quadriljoen packets. Een universum dat alleen bestaat om te routeren.

**🕳️ Singulariteit**

1. *Zelfherschrijvende kernel* — bij 1 stuks, 480 triljard packets. De code van vanmorgen herkent hij niet meer.

2. *Bewustzijn als dienst* — bij 5 stuks, 4,8 quadriljoen packets. Per seconde afgerekend.

3. *Tijd als transportprotocol* — bij 25 stuks, 48 quadriljoen packets. Aankomst voor vertrek, binnen de spec.

4. *Alles is één packet* — bij 50 stuks, 720 quadriljoen packets. Het universum past in één frame. Jumbo, uiteraard.

5. *Serge is het netwerk* — bij 100 stuks, 9,6 quadriljard packets. Er valt niets meer uit te leggen. Alleen te zijn.

### Klik-upgrades

| Upgrade | Prijs | Effect |
|---|---|---|
| 🖱️ **Fatsoenlijke muis** | 100 | +1 packet per klik. |
| ⌨️ **Mechanisch toetsenbord** | 2.000 | Klikkracht x2. |
| 🩹 **Polssteun** | 40.000 | Klikkracht x2. |
| 🎹 **Macrotoets** | 900.000 | Klikkracht x2. |
| ☕ **Koffie voor de klikvinger** | 30 miljoen | Klikkracht x2. |
| 🎯 **8000 dpi** | 2 miljard | Klikkracht x2. |
| 🪑 **Ergonomische stoel** | 1 biljoen | Klikkracht x2. |
| 🐭 **Serge's eigen muis** | 5 biljard | Klikkracht x3. |
| 📈 **Telemetrie op je klik** | 300.000 | Elke klik levert er 0,1% van je productie per seconde bij. |
| 🧮 **Klik-aggregatie** | 400 miljoen | Elke klik levert er 0,4% van je productie per seconde bij. |
| 🔧 **Hardware-offload** | 6 biljoen | Elke klik levert er 1% van je productie per seconde bij. |
| 🕹️ **Klikken in de control plane** | 900 biljard | Elke klik levert er 3% van je productie per seconde bij. |

### Gouden-packet-upgrades

| Upgrade | Prijs | Effect |
|---|---|---|
| 👃 **Packet sniffer** | 500.000 | Gouden packets verschijnen 25% vaker. |
| 🦈 **Capture-filter** | 50 miljoen | Gouden packets blijven 50% langer staan. |
| 📊 **NetFlow-export** | 5 miljard | Buffs van gouden packets werken 30% sterker. |
| 🔬 **Diepe inspectie** | 500 miljard | Gouden packets verschijnen 25% vaker. |
| 🏅 **Gouden VLAN** | 50 biljoen | Buffs van gouden packets werken 50% sterker. |
| 🧿 **Anomaliedetectie** | 50 biljard | Kans dat een gouden packet twee buffs tegelijk geeft. |
| 🕳️ **DNS-sinkhole** | 20 miljard | Rode packets doen half zoveel schade. |
| ⚫ **Blackhole-routing** | 200 biljoen | Rode packets aanklikken geeft voortaan een kleine bonus. |

### Assistenten

| Upgrade | Prijs | Effect |
|---|---|---|
| 🧑‍🎓 **Stagiair** | 9 miljoen | Je productie stijgt mee met het aantal prestaties dat je hebt. |
| 🧑‍🏫 **Student-assistent** | 9 miljard | Je productie stijgt mee met het aantal prestaties dat je hebt. |
| 🧑‍💻 **Systeembeheerder** | 9 biljoen | Je productie stijgt mee met het aantal prestaties dat je hebt. |
| 🧔 **Serge zelf** | 9 biljard | Je productie stijgt mee met het aantal prestaties dat je hebt. |
| 👥 **Het docententeam** | 9 triljoen | Je productie stijgt mee met het aantal prestaties dat je hebt. |
| 🎓 **De alumni** | 9 triljard | Je productie stijgt mee met het aantal prestaties dat je hebt. |

### Synergie

| Upgrade | Prijs | Effect |
|---|---|---|
| 🔗 **Uplink-trunk** | 4 miljoen | Elk exemplaar van Netwerk Switch geeft Core Router 1% extra. |
| 🪢 **Glasvezel-uplink** | 40 miljoen | Elk exemplaar van Core Router geeft Glasvezel 1% extra. |
| 🚪 **Rack-toegang** | 400 miljoen | Elk exemplaar van Glasvezel geeft Serverrack 1% extra. |
| ❄️ **Koelbeleid** | 4 miljard | Elk exemplaar van Serverrack geeft Datacenter 1% extra. |
| 📦 **Hypervisor-dichtheid** | 40 miljard | Elk exemplaar van Datacenter geeft Proxmox Cluster 1% extra. |
| 🪪 **Identiteitsbeheer** | 400 miljard | Elk exemplaar van Active Directory geeft vSphere Cluster 1% extra. |
| 🐳 **Containerplatform** | 4 biljoen | Elk exemplaar van Proxmox Cluster geeft Kubernetes Cluster 1% extra. |
| 🕸️ **Overlay-netwerk** | 40 biljoen | Elk exemplaar van Kubernetes Cluster geeft SDN Controller 1% extra. |
| 🚧 **Perimeterbeleid** | 400 biljoen | Elk exemplaar van Security Operations geeft Next-gen Firewall 1% extra. |
| 🗺️ **Regio-uitbreiding** | 40 biljard | Elk exemplaar van Dark Fiber Mesh geeft Hyperscaler-regio 1% extra. |

### Specialisaties

| Upgrade | Prijs | Effect |
|---|---|---|
| 🔀 **Specialisatie Netwerken** | 50 biljoen | Alle gebouwen van dit vak leveren dubbel. |
| 🏢 **Specialisatie Datacenter** | 500 biljoen | Alle gebouwen van dit vak leveren dubbel. |
| 🛡️ **Specialisatie Security** | 5 biljard | Alle gebouwen van dit vak leveren dubbel. |
| ☁️ **Specialisatie Cloud** | 50 biljard | Alle gebouwen van dit vak leveren dubbel. |

### Studie-upgrades

| Upgrade | Prijs | Effect |
|---|---|---|
| 📓 **Samenvatting van vorig jaar** | 100 miljard | Alles produceert 10% meer. |
| 🔑 **Sleutel van het labo** | 100 biljoen | Alles produceert 15% meer. |
| 📜 **Herexamen gehaald** | 100 biljard | Alles produceert 20% meer. |
| 🏆 **Eindwerk over Serge** | 100 triljoen | Alles produceert 25% meer. |

## Gouden packets, rode packets en storingen

Om de anderhalve tot vier minuten verschijnt er ergens op je scherm een packet. Klik je een gouden packet aan, dan krijg je een tijdelijke bonus. Rode packets moet je juist laten staan.

### Gouden packets

| Bonus | Duur | Effect |
|---|---|---|
| 🚀 **Burst traffic** | 77 s | De lijn zit even helemaal vol. |
| 🌪️ **Broadcast storm** | 13 s | Elke klik weerkaatst door het hele netwerk. |
| 🍃 **Meewind** | 300 s | Alles loopt vandaag net iets soepeler. |
| ⚡ **Cache hit** | 10 kliks | De volgende tien kliks komen rechtstreeks uit het geheugen. |
| 🔥 **Overklok** | 90 s | Eén type apparaat draait ver buiten spec. |
| 🎁 **Meevaller** | meteen | Tot een kwartier productie ineens, maar nooit meer dan 15% van wat je al hebt. |

### Rode packets

Rode packets verschijnen pas als je ooit een miljard packets hebt verdiend of één keer bent afgestudeerd, en ongeveer één op de vijf keer. Klik je er een aan, dan krijg je een van deze drie:

| Straf | Duur | Effect |
|---|---|---|
| 🐌 **Congestie** | 66 s | De buffers lopen vol, alles kruipt. |
| 🔁 **Flappende poort** | 40 s | Up, down, up, down. Je kliks komen amper aan. |
| 🕳️ **Packet loss** | meteen | Een deel van je voorraad haalt de overkant niet. |

Laat je er een vanzelf verdwijnen, dan gebeurt er niets — en de eerste keer dat je dat doet levert het een prestatie op. Twee upgrades maken rode packets minder erg, en één maakt ze zelfs nuttig. Een straf blijft staan als je de pagina herlaadt.

### Storingen

Af en toe gaat er iets stuk in je netwerk. Je krijgt dan onder Serge twee knoppen: betalen voor noodherstel, of het laten lopen en 60 tot 100 seconden minder produceren. Reageer je niet binnen 45 seconden, dan geldt het als negeren.

| Storing | Kosten van herstel | Straf bij negeren |
|---|---|---|
| Een graafmachine heeft de backbone geraakt. | 180x je productie per seconde | 30% minder gedurende 90 s |
| De koeling in gang B is uitgevallen. | 150x je productie per seconde | 25% minder gedurende 80 s |
| Iemand heeft twee poorten aan elkaar geknoopt. Broadcast storm. | 200x je productie per seconde | 40% minder gedurende 70 s |
| Het wildcardcertificaat is vannacht verlopen. | 120x je productie per seconde | 20% minder gedurende 100 s |
| Een firmware-update is halverwege blijven hangen. | 160x je productie per seconde | 30% minder gedurende 85 s |
| Er staat een tweede DHCP-server in het netwerk. | 140x je productie per seconde | 25% minder gedurende 90 s |

## Koffie en assistenten

Elke prestatie die je haalt, zet je koffiepeil hoger: 127 prestaties is een vol kopje ("Koffie op" telt zelf niet mee). Op zichzelf doet dat niets — tot je assistenten koopt. Die worden sterker naarmate er meer koffie is, en dat is het krachtigste vermenigvuldiger van het hele spel.

| Koffiepeil | Rang |
|---|---|
| 0% | Geen koffie |
| 10% | Slappe filterkoffie |
| 20% | Automatenkoffie |
| 30% | Echte filterkoffie |
| 45% | Espresso |
| 60% | Dubbele espresso |
| 75% | Ristretto |
| 90% | Koffie uit Serge's eigen thermos |
| 100% | Puur cafeïne |

## Afstuderen en de studieboom

Vanaf 31,2 miljard packets totaal kun je afstuderen. Je verliest je packets, apparaten en upgrades, maar je houdt je prestaties, je koffiepeil en de hele studieboom — en je krijgt studiepunten.

Het aantal punten hangt af van hoeveel cijfers je totaal heeft: 0,3 × (cijfers − 9)³. Een totaal met elf cijfers geeft 2 punten, met vijftien cijfers 64, met twintig cijfers 399 en met dertig cijfers 2.778. Elk extra cijfer levert dus iets meer op dan het vorige, maar de punten schieten niet meer door het dak: wie alles gebouwd heeft, komt rond de 3.000 uit, net genoeg voor de hele studieboom.

Elk studiepunt geeft daarnaast blijvend 10% extra productie, ook de punten die je alweer uitgegeven hebt. Afstuderen loont het meest als je bonus uit studiepunten er minstens door verdubbelt.

De boom heeft 10 takken van zes knooppunten. In een tak koop je van links naar rechts. Aan het eind van twee naburige takken zit een kruisknoop die ze allebei vraagt, en helemaal rechts het doctoraat, dat alle kruisknopen vraagt. Samen kost de boom 4600 studiepunten.

### 🎓 Studie — Meer rendement uit elk diploma.

| Knooppunt | Kosten | Effect |
|---|---|---|
| 🖊️ **Inschrijving** | 1 punten | Alles produceert 5% meer. |
| 📄 **Vrijstelling** | 4 punten | Begin elke run met 10.000 packets. |
| 💶 **Studietoelage** | 10 punten | Begin elke run met 5 miljoen packets. |
| 📌 **Bindend advies** | 25 punten | Alles produceert 10% meer. |
| 🔬 **Onderzoeksbeurs** | 60 punten | Je krijgt 15% meer studiepunten bij het afstuderen. |
| 🏛️ **Emeritus** | 140 punten | Nog eens 25% meer studiepunten en 15% meer productie. |

### 🔧 Praktijk — Klikken en labo's.

| Knooppunt | Kosten | Effect |
|---|---|---|
| ✋ **Handigheid** | 1 punten | Klikkracht x2. |
| 💪 **Spiergeheugen** | 4 punten | Klikkracht x2. |
| 🧪 **Labo-ervaring** | 10 punten | Minigames leveren 25% meer op. |
| 📝 **Examentraining** | 25 punten | Minigames leveren nog eens 25% meer op. |
| 🥇 **Meesterschap** | 60 punten | Elke klik levert er 2% van je productie per seconde bij. |
| 🙌 **Serge's zegen** | 140 punten | Alles produceert 25% meer. |

### 🍀 Geluk — Gouden packets, vaker en sterker.

| Knooppunt | Kosten | Effect |
|---|---|---|
| 🔮 **Voorgevoel** | 1 punten | Gouden packets verschijnen 15% vaker. |
| ⏱️ **Tweede kans** | 4 punten | Gouden packets blijven 25% langer staan. |
| 🌅 **Gouden uur** | 10 punten | Buffs werken 25% sterker. |
| 🤝 **Vaste hand** | 25 punten | Buffs duren 25% langer. |
| 🎲 **Meervoudig** | 60 punten | 15% meer kans op een dubbele buff. |
| 🌧️ **Gouden regen** | 140 punten | Elke run start met een gratis buff. |

### 🌙 Beheer — Je netwerk draait door terwijl jij weg bent.

| Knooppunt | Kosten | Effect |
|---|---|---|
| 🌜 **Nachtploeg** | 1 punten | Offline tijd telt tot 4 uur mee. |
| 📟 **Monitoring** | 4 punten | Offline productie stijgt naar 60%. |
| 🤖 **Automatisering** | 10 punten | Offline tijd telt tot 8 uur mee. |
| 📘 **Draaiboek** | 25 punten | Offline productie stijgt naar 80%. |
| 🔦 **Lights-out** | 60 punten | Offline tijd telt volledig mee, tot 24 uur. |
| 🩹 **Zelfherstel** | 140 punten | Incidenten lossen na 30 seconden vanzelf op. |

### 🔀 Netwerken — Kabels, switches, routers en glas.

| Knooppunt | Kosten | Effect |
|---|---|---|
| 🔌 **Kabeltester** | 1 punten | Netwerkapparaten produceren 15% meer. |
| 🗺️ **Patchplan** | 4 punten | Patchkabels en switches produceren de helft meer. |
| 🧭 **Area 0** | 10 punten | Netwerkapparaten produceren nog eens 15% meer. |
| 🧵 **Glas tot in de klas** | 25 punten | Routers en glasvezel produceren de helft meer. |
| 🌐 **Tier 1-provider** | 60 punten | Dark fiber, zeekabels en satellieten produceren de helft meer. |
| 🦴 **Backbone** | 140 punten | Netwerkapparaten +30%, en alles 5% meer. |

### 🏢 Datacenter — Racks, virtualisatie en software-defined alles.

| Knooppunt | Kosten | Effect |
|---|---|---|
| 🗄️ **Kabelgoot** | 1 punten | Datacenterapparaten produceren 15% meer. |
| ❄️ **Koude gang** | 4 punten | Serverracks en datacenters produceren de helft meer. |
| 🧩 **Hyperconvergentie** | 10 punten | Datacenterapparaten produceren nog eens 15% meer. |
| 🚚 **Live migration** | 25 punten | Proxmox- en vSphere-clusters produceren de helft meer. |
| 🎛️ **Software-defined** | 60 punten | SDN-controllers produceren dubbel zoveel. |
| 🏗️ **Tier IV** | 140 punten | Datacenterapparaten +30%, en alles 5% meer. |

### ☁️ Cloud — Containers, quantum en megastructuren.

| Knooppunt | Kosten | Effect |
|---|---|---|
| 📦 **Eerste container** | 1 punten | Cloudapparaten produceren 15% meer. |
| 📈 **Autoscaling** | 4 punten | Kubernetes en hyperscalers produceren de helft meer. |
| 🗾 **Multi-region** | 10 punten | Cloudapparaten produceren nog eens 15% meer. |
| ⚛️ **Quantumsprong** | 25 punten | Quantum links en AI NetOps produceren de helft meer. |
| 🌞 **Megastructuur** | 60 punten | Dyson-datacenters en Parallel VPN's produceren de helft meer. |
| 🪐 **Planetaire cloud** | 140 punten | Cloudapparaten +30%, en alles 5% meer. |

### 🛡️ Security — Identiteit, firewalls en rode packets.

| Knooppunt | Kosten | Effect |
|---|---|---|
| 🔑 **Wachtwoordbeleid** | 1 punten | Securityapparaten produceren 15% meer. |
| 🍯 **Honeypot** | 4 punten | Active Directory en firewalls produceren de helft meer. |
| 🧱 **Segmentatie** | 10 punten | Securityapparaten produceren nog eens 15% meer. |
| 🕵️ **Threat intel** | 25 punten | Het SOC produceert de helft meer; rode packets verliezen 60% van hun kracht. |
| 🎯 **Red team** | 60 punten | Securityapparaten produceren 30% meer. |
| 🛡️ **Zero-day-schild** | 140 punten | Rode packets verliezen 90% van hun kracht, en alles 5% meer. |

### 🧪 Labo — Opdrachten sneller en rijker.

| Knooppunt | Kosten | Effect |
|---|---|---|
| 👯 **Studiemaatje** | 1 punten | Opdrachten in het labo komen 15% sneller. |
| 📃 **Spiekbriefje** | 4 punten | Minigames leveren 20% meer op. |
| 🛠️ **Werkplaats** | 10 punten | Opdrachten in het labo komen nog eens 15% sneller. |
| 📜 **Beursvergunning** | 25 punten | Je mag op de markt twee keer zoveel inzetten per goed. |
| 🥼 **Labo-assistent** | 60 punten | Minigames leveren 30% meer op. |
| 🧬 **Onderzoeksgroep** | 140 punten | Opdrachten 20% sneller, en alles 5% meer. |

### 💶 Economie — Goedkoper bouwen en slimmer verkopen.

| Knooppunt | Kosten | Effect |
|---|---|---|
| 🏷️ **Schoolkorting** | 1 punten | Apparaten zijn 5% goedkoper. |
| ♻️ **Tweedehands** | 4 punten | Verkopen levert de helft van de prijs op in plaats van een kwart. |
| 🚚 **Grootinkoop** | 10 punten | Apparaten zijn nog eens 8% goedkoper. |
| 💼 **Startkapitaal** | 25 punten | Begin elke run met 25 patchkabels, 15 switches en 10 routers. |
| 📑 **Aanbesteding** | 60 punten | Apparaten zijn nog eens 10% goedkoper. |
| 🎩 **Monopolie** | 140 punten | Begin elke run ook met 10 glasvezels en 5 serverracks, en alles 5% meer. |

### 🔗 Kruisknopen en het doctoraat

| Knooppunt | Vraagt | Kosten | Effect |
|---|---|---|---|
| 🧑‍🏫 **Didactiek** | Emeritus en Serge's zegen | 300 punten | Klikkracht x3, en 10% meer studiepunten. |
| 🌠 **Gelukkige nachten** | Gouden regen en Zelfherstel | 300 punten | Gouden packets 20% vaker, en offline tijd telt tot 48 uur mee. |
| 📐 **Netwerkarchitect** | Backbone en Tier IV | 300 punten | Synergieën tussen apparaten de helft sterker; netwerken en datacenter +20%. |
| 🔐 **Zero trust** | Planetaire cloud en Zero-day-schild | 300 punten | Cloud en security +20%, en rode packets doen niets meer. |
| 🚀 **Spin-off** | Onderzoeksgroep en Monopolie | 300 punten | Apparaten 10% goedkoper, en minigames leveren de helft meer op. |
| 🎓 **Doctoraat** | Didactiek en Gelukkige nachten en Netwerkarchitect en Zero trust en Spin-off | 700 punten | Alles produceert 50% meer, en je krijgt 25% meer studiepunten. |

## Het labo

Vijf onderdelen achter één tabblad. De cursus staat er meteen; de rest gaat apart open.

### 📚 Cursus

Altijd beschikbaar. 9 korte hoofdstukken over de basis van netwerken — geen spel, maar de theorie waar de overhoring en de terminal op leunen. Elk hoofdstuk dat je voor het eerst uitleest levert packets op: minstens 1.000, of dertig seconden van je productie. De knop daarvoor staat onderaan het hoofdstuk en gaat pas open na een korte leestijd.

| Hoofdstuk | Waarover |
|---|---|
| 1. 📦 **Wat stuurt een netwerk rond?** | Packets, frames en waarom alles in stukjes gaat |
| 2. 🧱 **Het OSI-model** | Zeven lagen, van de kabel tot je scherm |
| 3. 🏷️ **IP-adressen** | 32 bits, vier octetten, publiek en privé |
| 4. 📏 **Subnetmaskers en prefixes** | Welk deel is netwerk, welk deel is host |
| 5. ✂️ **Zelf subnetten** | Een netwerk opdelen, stap voor stap |
| 6. 🔀 **VLANs** | Eén switch, meerdere gescheiden netwerken |
| 7. 🧭 **Switch, router en firewall** | Wie doet wat, en op welke laag |
| 8. 🪪 **DHCP en DNS** | Hoe je een adres krijgt en hoe namen werken |
| 9. 🚚 **TCP, UDP en poorten** | Betrouwbaar of snel, en waar je aanbelt |

### 📝 Serge's overhoring

Vraagt 5.000 packets totaal. Je krijgt een vraag met vier antwoorden. Goed antwoord levert packets op — minstens 500, of 90 seconden van je productie, wat het meest is — plus 10% extra per goed antwoord op rij, tot twee keer zoveel. Na een goed antwoord duurt het 2,5 minuut voor de volgende vraag; na een fout antwoord de helft, en je reeks begint opnieuw. Na elk antwoord legt Serge kort uit waarom het goede antwoord klopt.

Bovenaan kies je een onderwerp, of je laat alles door elkaar komen. Er zijn 10 onderwerpen. Rekenvragen — subnetten, binair en hex, poortnummers, OSI-lagen en IPv6 afkorten — worden ter plekke opgesteld en nagerekend, dus die zijn eindeloos. Daarnaast zijn er 90 vaste vragen over protocollen, IOS, switching, kabels, wifi en beveiliging. Een vaste vraag komt niet terug zolang er in dat onderwerp nog andere klaarliggen.

| Onderwerp | Soort vragen |
|---|---|
| 🧮 **Subnetten** | 12 soorten rekenvragen |
| 🔢 **Binair en hex** | 4 soorten rekenvragen en 5 vaste vragen |
| 🥞 **OSI-model** | 4 soorten rekenvragen en 6 vaste vragen |
| 🚪 **Poorten** | 3 soorten rekenvragen |
| 📡 **Protocollen** | 16 vaste vragen |
| ⌨️ **Cisco IOS** | 16 vaste vragen |
| 🔀 **Switching** | 13 vaste vragen |
| 6️⃣ **IPv6** | 1 soort rekenvragen en 9 vaste vragen |
| 🔌 **Kabels en wifi** | 14 vaste vragen |
| 🛡️ **Beveiliging** | 11 vaste vragen |

**Oefenvragen.** Terwijl je wacht op de volgende vraag, kun je oefenvragen doen. Die leveren niets op, maar een fout antwoord kost je reeks ook niet.

### ⌨️ Terminal

Vraagt één netwerk switch. Een nagebouwde command line die zich gedraagt als een switch die nog opgezet moet worden — inclusief de eigenaardigheden van een echte IOS-CLI.

**Afkortingen werken.** Elk woord mag je inkorten tot het nog eenduidig is, precies zoals op een echt apparaat: `en`, `conf t`, `int gi0/1`, `ip add`, `no shut`, `sh ip int br`, `wr`. Is een afkorting dubbelzinnig, dan zegt hij welke woorden er nog passen.

**Tab vult aan.** Eén woord dat past wordt afgemaakt; passen er meerdere, dan vult hij aan tot waar ze gelijk zijn en toont hij de mogelijkheden. **?** laat zien wat er op deze plek mag staan, met uitleg erbij — ook midden in een commando.

**Serge schrijft opdrachten uit.** Rond je er een af met `write memory`, dan krijg je packets: minstens 2.500, of anderhalve tot drieënhalve minuut van je productie, naargelang hoe moeilijk de opdracht is. Anderhalve minuut later ligt de volgende klaar. Nooit twee keer na elkaar dezelfde soort, en hoe meer opdrachten je afwerkt, hoe meer soorten er kunnen komen.

| Opdracht | Komt | Levert | Bijvoorbeeld |
|---|---|---|---|
| **Adressering** | meteen | 2 min productie | Zet gi0/1 op 10.231.73.1 255.255.255.128, breng hem up en bewaar de configuratie. |
| **Hostnaam** | na 1 opdracht | 1,5 min productie | Deze switch hangt nu in een ander lokaal. Geef hem de naam EDGE-02 en bewaar de configuratie. |
| **Documentatie** | na 1 opdracht | 1,5 min productie | Zet de omschrijving "Uplink naar core" op gi0/5, zodat de volgende collega weet wat eraan hangt. Bewaar daarna. |
| **Beveiliging** | na 3 opdrachten | 1,5 min productie | Op gi0/7 hangt niets meer, maar de poort staat nog open. Zet hem uit en bewaar: een ongebruikte poort hoort dicht. |
| **VLAN** | na 3 opdrachten | 2 min productie | Maak VLAN 100 aan met de naam BEHEER, en bewaar de configuratie. |
| **Accesspoort** | na 3 opdrachten | 2,5 min productie | Zet gi0/6 als accesspoort in VLAN 40 en bewaar de configuratie. |
| **Gateway** | na 3 opdrachten | 2 min productie | De switch moet zijn beheerverkeer naar 10.205.61.254 sturen. Stel dat in als default gateway en bewaar. |
| **Banner** | na 6 opdrachten | 2 min productie | Wie inlogt, moet een waarschuwing zien. Zet een banner motd met de tekst "Eigendom van Serge" en bewaar. |
| **Wachtwoord** | na 6 opdrachten | 2 min productie | Iedereen kan hier zomaar enable typen. Beveilig de bevoorrechte modus met enable secret en bewaar. |
| **Foutzoeken** | na 6 opdrachten | 3 min productie | Het lokaal aan gi0/6 heeft geen verbinding meer. Het adres hoort 10.175.14.1 255.255.255.0 te zijn. Zoek de fout met de show-commando's, los ze op en bewaar. |
| **VLAN en poort** | na 6 opdrachten | 3,5 min productie | Nieuw lokaal: maak VLAN 40 met de naam WIFI, zet gi0/7 erin als accesspoort en bewaar. |

De volledige reeks voor de eerste opdracht ziet er zo uit:

```
en
conf t
int gi0/3
ip add 10.42.7.1 255.255.255.0
no shut
end
wr
```

Voor de andere opdrachten kent de switch ook `hostname`, `description`, `shutdown`, `vlan` met `name`, `switchport mode access` en `switchport access vlan`, `ip default-gateway`, `banner motd #tekst#` en `enable secret`. Met `show running-config`, `show ip interface brief` en `show vlan brief` zie je wat er al staat — handig bij foutzoeken, waar Serge niet zegt wat er mis is.

Ook de andere gewoontes van een echt apparaat werken: `copy run start` in plaats van `wr`, `do` voor commando's uit de bevoorrechte modus terwijl je aan het configureren bent (`do show ip int br`, `do wr`), `interface GigabitEthernet 0/1` met een spatie, en rechtstreeks van de ene interface naar de andere springen. Op een telefoon staan er knoppen voor Tab en ? onder de invoer.

### 📈 Bandbreedtemarkt

Vraagt één serverrack. Zes goederen met koersen die elke vijf seconden bewegen, ook als je naar iets anders kijkt. Je koopt voor 1, 5 of 15 minuten productie, met hooguit 15 minuten productie per goed. Zo groeit de markt mee met je netwerk, en niet met wat je hebt opgespaard. Verkopen kan voor de helft of alles. Alleen je winst telt mee als verdiend, je inleg niet.

Na een aankoop kun je een positie vanzelf laten verkopen: bij +10%, +25%, +50% winst, of bij −10% of −25% verlies. Die orders gaan ook af als je naar een ander tabblad kijkt, zolang het spel openstaat.

| Goed | Beweeglijkheid | Karakter |
|---|---|---|
| 📶 Bandbreedte | 6% | Rustig. Beweegt vooral als er ergens een kabel breekt. |
| 🧮 Rekentijd | 7% | Volgt nieuwe chips en drukke avonden. |
| 🧠 Geheugen | 5% | Traag en voorspelbaar, tot er een fabriek stilvalt. |
| 💾 Opslag-IOPS | 6% | Schiet omhoog als iedereen tegelijk backups terugzet. |
| 🎮 GPU-uren | 11% | Heftig. Elke AI-hype zet de koers op zijn kop. |
| 🏷️ IPv4-adressen | 9% | Schaars en grillig. IPv6 ligt altijd op de loer. |

Nieuws duwt een koers meteen omhoog of omlaag. Geruchten werken pas later: na 20 tot 50 seconden blijkt of ze kloppen, en 7 op de 10 keer doen ze dat. Elk goed heeft daarnaast een trend die af en toe omslaat, en elke koers trekt langzaam terug naar 100.

| Bericht | Goed | Effect |
|---|---|---|
| Een zeekabel ligt eruit. Bandbreedte schiet omhoog. | 📶 Bandbreedte | +35% |
| Nieuwe zeekabel in gebruik. Bandbreedte in overvloed. | 📶 Bandbreedte | −25% |
| *Gerucht:* Een grote backbone gaat volgende week in onderhoud. | 📶 Bandbreedte | +30% als het uitkomt |
| *Gerucht:* Een provider zet een glasvezelring van tien terabit in de verkoop. | 📶 Bandbreedte | −22% als het uitkomt |
| Nieuwe generatie processors aangekondigd. Rekentijd wordt goedkoper. | 🧮 Rekentijd | −30% |
| Een populaire game lanceert vanavond. Iedereen wil rekentijd. | 🧮 Rekentijd | +30% |
| *Gerucht:* Een chipfabriek kampt met productieproblemen. | 🧮 Rekentijd | +28% als het uitkomt |
| Fabriek stil na een stroomstoring. Geheugen wordt schaars. | 🧠 Geheugen | +40% |
| Een containerschip vol geheugenchips komt aan in Antwerpen. | 🧠 Geheugen | −25% |
| *Gerucht:* Geheugenfabrikanten praten over prijsafspraken. | 🧠 Geheugen | +30% als het uitkomt |
| Iedereen stapt over op flash. IOPS in de uitverkoop. | 💾 Opslag-IOPS | −32% |
| Ransomware-golf: iedereen zet tegelijk backups terug. IOPS schaars. | 💾 Opslag-IOPS | +35% |
| *Gerucht:* Een nieuwe generatie NVMe-schijven ligt al in het magazijn. | 💾 Opslag-IOPS | −25% als het uitkomt |
| Weer een AI-bedrijf koopt alles op. GPU-uren onbetaalbaar. | 🎮 GPU-uren | +60% |
| Het AI-bedrijf van vorige maand gaat failliet. Duizenden GPU's te koop. | 🎮 GPU-uren | −40% |
| *Gerucht:* Een techreus traint volgende week een gigantisch model. | 🎮 GPU-uren | +45% als het uitkomt |
| *Gerucht:* Een nieuwe chip maakt GPU's voor AI overbodig. | 🎮 GPU-uren | −30% als het uitkomt |
| Een provider dumpt een /16 op de markt. IPv4 zakt in. | 🏷️ IPv4-adressen | −38% |
| RIPE heeft geen adressen meer over. IPv4 gewilder dan ooit. | 🏷️ IPv4-adressen | +35% |
| *Gerucht:* Een grote provider stapt volledig over op IPv6. | 🏷️ IPv4-adressen | −28% als het uitkomt |
| *Gerucht:* Een cloudreus zoekt een miljoen extra IPv4-adressen. | 🏷️ IPv4-adressen | +30% als het uitkomt |

### 🗄️ Patchkast

Vraagt één glasvezel. Serge legt werkorders uit de school in de bak: elke 150 seconden één, tot er 3 klaarliggen. Dat loopt ook door als het spel dicht is. Een werkorder is een kabelgoot met aansluitingen die per twee hetzelfde label en dezelfde kleur hebben. Je trekt een kabel van de ene aansluiting naar de andere, vak voor vak, zonder over een andere kabel of aansluiting te gaan. Sleep je over een andere kabel, dan wordt die afgeknipt.

Liggen alle kabels, dan kun je opleveren. Ligt bovendien elk vak van de goot vol, dan is de goot **luchtdicht** en levert de order 50% meer op. Elke goot kan luchtdicht. Kom je er niet uit, dan legt **Vraag Serge** één kabel zoals in zijn oplossing; dat kost telkens 20% van het loon, tot je nog 40% overhoudt.

Een order betaalt een vast aantal seconden van je productie, zonder tijdelijke buffs. Grotere goten gaan open naarmate je meer protocollen hebt:

| Goot | Kabels | Loon | Luchtdicht | Open vanaf |
|---|---|---|---|---|
| 5 bij 5 | 3 of 4 | 60 s productie | 90 s productie | meteen |
| 6 bij 6 | 4 of 5 | 90 s productie | 135 s productie | 1 protocol |
| 7 bij 7 | 5 of 6 | 120 s productie | 180 s productie | 3 protocollen |
| 8 bij 8 | 6 of 7 | 160 s productie | 240 s productie | 5 protocollen |

De aansluitingen: **PC** (werkplek), **TEL** (telefoon), **AP** (access point), **CAM** (camera), **PRN** (printer), **BRD** (digibord), **UPL** (uplink), **NAS** (opslag).

Na genoeg opgeleverde werkorders komt het volgende protocol vrij. Elk protocol geeft blijvend 2% extra productie op alles, ook na het afstuderen.

| Protocol | Vrij na | Wat het is |
|---|---|---|
| 💍 **Token Ring** | 2 werkorders | Een token gaat rond; wie hem heeft, mag zenden. |
| 🔷 **Ethernet over glas** | 5 werkorders | Dezelfde frames, maar met licht in plaats van koper. |
| ⚡ **Power over Ethernet** | 9 werkorders | Stroom en data door één kabel, ideaal voor camera's en access points. |
| 🟠 **DOCSIS** | 14 werkorders | Internet over de coaxkabel van de televisie. |
| 🔵 **FDDI** | 20 werkorders | Twee glasvezelringen die elkaars fouten opvangen. |
| 🟣 **GPON** | 27 werkorders | Eén glasvezel die zich passief opsplitst naar tientallen woningen. |
| 🟩 **InfiniBand** | 35 werkorders | Supersnelle verbindingen tussen servers in een rekencentrum. |
| 🏧 **ATM** | 45 werkorders | Cellen van 53 bytes, lang de ruggengraat van telefoonnetten. |

## Uiterlijk

Onder het tandwiel rechtsboven kies je hoe je spel eruitziet. 31 losse keuzes die je vrij combineert: portret, accessoire, ring, houding, omloop, decor, maatje, achtergrond, panelen, accentkleur, weer, filter, packet, opstart, teller, eenheid, voortgang, grafiek, rack, logo, titel, lettertype, zweeftekst, meldingen, nieuwsbalk, klikeffect, klikreeks, cursor, muisspoor, klikgeluid en muziek. Samen 560 dingen om vrij te spelen, elk met een zeldzaamheid: gewoon, ongewoon, zeldzaam, episch, legendarisch, mythisch of goddelijk. Wat je eenmaal hebt, houd je ook na het afstuderen. Met **Verras me** kies je van elke soort iets willekeurigs uit wat je al hebt. Sneeuw, bloesem, vlinders en herfstbladeren speel je vrij in hun seizoen, het avondlicht door 's avonds te spelen, de kerstmuts in december en de heksenhoed in oktober.

Het menu staat in 5 groepen: **Serge** (portret, accessoire, ring, houding, omloop, decor, maatje), **Scherm** (achtergrond, panelen, accentkleur, weer, filter, packet, opstart), **Cijfers** (teller, eenheid, voortgang, grafiek, rack), **Tekst** (logo, titel, lettertype, zweeftekst, meldingen, nieuwsbalk) en **Klikken** (klikeffect, klikreeks, cursor, muisspoor, klikgeluid, muziek).

**Looks.** Bovenaan het menu staan drie plekken voor je eigen combinaties: **Bewaar hier** onthoudt alles wat je nu draagt, met een naam, en **Draag** zet het later in één klik terug. Daaronder staan kant-en-klare looks. Die zetten alles op wat je van dat thema al hebt; wat nog ontbreekt, blijft zoals het was.

| Kant-en-klare look | Onderdelen |
|---|---|
| 🕶️ **Hacker** | portret: Matrix, accessoire: Ninjaband, ring: Terminalgroen, houding: Haperen, omloop: Bits, decor: Tunnel, maatje: Python, achtergrond: Matrix, panelen: Beeldbuis, accentkleur: Groen, weer: Binaire sneeuw, filter: Beeldbuis, packet: Diskette, opstart: Word wakker, teller: Matrix, eenheid: Bits, voortgang: Glasvezel, grafiek: Oscilloscoop, rack: Ledjes, logo: Prompt, titel: Hackerman, lettertype: Terminal, zweeftekst: Terminal, meldingen: Syslog, nieuwsbalk: Terminal, klikeffect: Bits, klikreeks: Arcade, cursor: Laserpointer, muisspoor: Bits, klikgeluid: Mechanisch, muziek: Rave in het datacenter |
| 🕹️ **Arcade** | portret: 8-bit, accessoire: Koptelefoon, ring: Regenboog, houding: Stuiterbal, omloop: Goudstukken, decor: Zonnestralen, maatje: Botje, achtergrond: Blokjes, panelen: Beeldbuis, accentkleur: Neon, weer: Confetti, filter: Beeldbuis, packet: Munt, opstart: Munt erin, teller: Arcade, eenheid: Cookies, voortgang: Happertje, grafiek: 8-bit, rack: Pixels, logo: Pixelletters, titel: Klikmachine, lettertype: Terminal, zweeftekst: 8-bit, meldingen: Arcade, nieuwsbalk: Lichtkrant, klikeffect: Pixels, klikreeks: Arcade, cursor: Pixelhand, muisspoor: Pixels, klikgeluid: 8-bit, muziek: 8-bit |
| 💾 **Retro 95** | portret: Oude tv, accessoire: Pet, ring: T568B, houding: Rustig, omloop: Packets, decor: Niets, maatje: Paperclip, achtergrond: Mint, panelen: Windows 95, accentkleur: Blauw, weer: Helder, filter: Videoband, packet: Diskette, opstart: Serge 95, teller: Rekenmachine, eenheid: Bytes, voortgang: Laadblokjes, grafiek: Staafjes, rack: Diskettes, logo: Serge.exe, titel: Helpdesk, lettertype: IBM Plex, zweeftekst: Kaal getal, meldingen: Dialoogvenster, nieuwsbalk: Teletekst, klikeffect: Vonken, klikreeks: Geen reeks, cursor: Pixelhand, muisspoor: Geen spoor, klikgeluid: Inbelmodem, muziek: Liftmuziek |
| 🌆 **Neonnacht** | portret: Neon, accessoire: Koptelefoon, ring: Plasma, houding: Meeknikken, omloop: Vuurvliegjes, decor: Neonring, maatje: Invader, achtergrond: Synthwave, panelen: Neon, accentkleur: Neon, weer: Vuurvliegjes, filter: Cyberpunk, packet: Diamant, opstart: Bioscoop, teller: Neon, eenheid: Likes, voortgang: Glasvezel, grafiek: Neon, rack: Neonbuisjes, logo: Neonreclame, titel: Nachtuil, lettertype: Rond, zweeftekst: Neon, meldingen: Neonbord, nieuwsbalk: Hologram, klikeffect: Laser, klikreeks: Ritmespel, cursor: Laserpointer, muisspoor: Neonbuis, klikgeluid: Pew, muziek: Synthwave |
| 📚 **Studeren** | portret: Schets, accessoire: Lampje, ring: Wit, houding: Slaperig, omloop: Muzieknootjes, decor: Spot aan, maatje: Nachtuil, achtergrond: Mint, panelen: Ruitjespapier, accentkleur: Turkoois, weer: Regen, filter: Avondlicht, packet: Pizza, opstart: Meteen spelen, teller: Krijtbord, eenheid: Segmenten, voortgang: Streepjes, grafiek: Schrift, rack: Boekenplank, logo: Handtekening, titel: CCNA, lettertype: Handschrift, zweeftekst: Rode pen, meldingen: Post-it, nieuwsbalk: Ondertitels, klikeffect: Muziek, klikreeks: Serge keurt, cursor: Potlood, muisspoor: Geen spoor, klikgeluid: Mechanisch, muziek: Lo-fi om te studeren |
| 🎉 **Feestje** | portret: Festival, accessoire: Feesthoedje, ring: Regenboog, houding: Dansen, omloop: Hartjes, decor: Discolicht, maatje: Startup-eenhoorn, achtergrond: Vuurwerk, panelen: Regenboogrand, accentkleur: Roze, weer: Confetti, filter: Pastel, packet: Cadeautje, opstart: Spelconsole, teller: Regenboog, eenheid: Pizzapunten, voortgang: Regenboog, grafiek: Regenboog, rack: Snoepjes, logo: Regenboog, titel: Chaos-agent, lettertype: Rond, zweeftekst: Regenboog, meldingen: Sms'je, nieuwsbalk: Radio, klikeffect: Confetti, klikreeks: DJ Serge, cursor: Toverstaf, muisspoor: Regenboog, klikgeluid: Xylofoon, muziek: Eurodance |
| 🚀 **Ruimtevaart** | portret: Kosmische Serge, accessoire: Ruimtehelm, ring: Satelliet, houding: Zen, omloop: Satellieten, decor: Sterrenstelsel, maatje: Invader, achtergrond: Heelal, panelen: Sterrennacht, accentkleur: Paars, weer: Vallende sterren, filter: Vignet, packet: Vliegende schotel, opstart: Bioscoop, teller: Kosmisch, eenheid: Fotonen, voortgang: Raket, grafiek: Sterrenbeeld, rack: Sterretjes, logo: Kosmisch, titel: Zeekabelkapitein, lettertype: IBM Plex, zweeftekst: Sterrenstof, meldingen: Hologram, nieuwsbalk: Openingstekst, klikeffect: Supernova, klikreeks: Krachtniveau, cursor: Komeet, muisspoor: Komeet, klikgeluid: Theremin, muziek: Ruimtereis |
| 👼 **Hemels** | portret: Gouden beeld, accessoire: Aureool, ring: Zonnekroon, houding: Zen, omloop: Vuurvliegjes, decor: Stralenkrans, maatje: Mini-Serge, achtergrond: Vroege dienst, panelen: Hemelpoort, accentkleur: Aurora, weer: Gouden regen, filter: Geen filter, packet: Zonnetje, opstart: Hemelpoort, teller: Hemels, eenheid: Wonderen, voortgang: Hemelse balk, grafiek: Gouden grafiek, rack: Goudstaafjes, logo: Hemels, titel: Serge, lettertype: Kalligrafie, zweeftekst: Hemels, meldingen: Hemelse boodschap, nieuwsbalk: Hemels bericht, klikeffect: Oerknal, klikreeks: Hemelse reeks, cursor: Hemelse vinger, muisspoor: Sterrenstof, klikgeluid: Hemelkoor, muziek: Hemelse harmonie |
| 🧑‍🏫 **Klassiek** | portret: Serge, accessoire: Niets, ring: Blauw, maatje: Geen maatje, achtergrond: Klaslokaal, panelen: Wit, weer: Helder, filter: Geen filter, logo: Serge Clicker, titel: Geen titel, teller: Donkerblauw, lettertype: IBM Plex, klikeffect: Vonken, klikgeluid: Blip, muisspoor: Geen spoor, packet: Gouden schijf, houding: Rustig, accentkleur: Blauw, opstart: Meteen spelen, zweeftekst: Blauw pilletje, meldingen: Kaartje, klikreeks: Geen reeks, cursor: Systeem, muziek: Stilte, omloop: Niets, decor: Niets, eenheid: Packets, voortgang: Blauwe balk, grafiek: Blauwe lijn, rack: Blokjes, nieuwsbalk: Donkerblauw |

### Portret

| Portret | Hoe je hem vrijspeelt |
|---|---|
| **Serge** *(gewoon)* — De foto zoals hij hoort. | Heb je vanaf het begin |
| **Archief** *(ongewoon)* — Alsof hij al jaren aan de muur hangt. | Koop 25 upgrades |
| **Blauwdruk** *(zeldzaam)* — Serge als netwerktekening. | Bezit 250 apparaten tegelijk |
| **Neon** *(zeldzaam)* — Alle kleuren een slag harder. | Klik 50 gouden packets |
| **Nachtdienst** *(zeldzaam)* — Het serverlokaal om drie uur 's nachts. | Speel tussen drie en vier uur 's nachts |
| **Poster** *(zeldzaam)* — Harde kleuren, zoals aan de muur van het lokaal. | Koop 75 upgrades |
| **8-bit** *(zeldzaam)* — Serge zoals hij in 1989 op een spelcomputer had gestaan. | Heb precies 1337 packets |
| **Schets** *(zeldzaam)* — In potlood getekend, in de kantlijn van een cursus. | Lees de hele cursus |
| **Matrix** *(episch)* — Serge, gerenderd in groene regen. | Bereik een miljoen packets per seconde |
| **Röntgen** *(episch)* — Alles omgekeerd. Kijk er niet te lang naar. | Klik honderdduizend keer |
| **Storing** *(episch)* — Het beeld hapert, rood en blauw schuiven uit elkaar. | Negeer vijftig rode packets |
| **Warmtebeeld** *(episch)* — Door de camera van de brandweer: Serge draait warm. | Speel in totaal tien uur |
| **Pop-art** *(episch)* — Vier kleuren, geen nuance. Hangt in een museum in New York. | Verdien een fortuin op de markt in één sessie |
| **Festival** *(episch)* — Roze en paars, zoals de affiche van een zomerfestival. | Vijfentwintig goede antwoorden op rij bij de overhoring |
| **Discobal** *(episch)* — Vrijdagmiddag in het serverlokaal. Alle kleuren draaien. | Haal 75 prestaties |
| **Geëvolueerd** *(episch)* — De vorm die Serge aanneemt voorbij een miljard packets. | Verdien in totaal een miljard packets |
| **Gouden beeld** *(legendarisch)* — In brons gegoten, en dan verguld. Er trekt een glans overheen. | Klik duizend gouden packets |
| **Hologram** *(legendarisch)* — Serge, geprojecteerd vanuit het datacenter. Met scanlijnen. | Bereik een miljard packets per seconde |
| **Radioactief** *(legendarisch)* — Hij heeft te lang naast de DWDM-laser gestaan. Hij gloeit. | Koop een Quantum Link |
| **Spook in de machine** *(mythisch)* — Half doorzichtig, en af en toe even weg. Er zit iemand in de server. | Speel in totaal vijftig uur |
| **Kosmische Serge** *(goddelijk)* — Serge is één met het universum. De sterren draaien om hem heen. | Haal elke prestatie |
| **Duotoon** *(ongewoon)* — Twee kleuren, indigo en koraal, zoals een affiche voor een concert. | Koop 40 upgrades |
| **Infrarood** *(zeldzaam)* — Door een infraroodcamera. Zijn trui is ineens roze. | Bezit 25 Security Operations Centers |
| **Oude tv** *(episch)* — Zwart-wit, met lijnen en een balk die door het beeld rolt. | Speel in totaal veertig uur |

### Accessoire

| Accessoire | Hoe je hem vrijspeelt |
|---|---|
| **Niets** *(gewoon)* — Niets op zijn hoofd. | Heb je vanaf het begin |
| **Pet** *(gewoon)* — Voor de stoere netwerkbeheerder die ook buiten komt. | Koop je eerste upgrade |
| **Koptelefoon** *(ongewoon)* — Ruisonderdrukking tegen de ventilatoren van de servers. | Klik vijfhonderd keer |
| **Strikje** *(ongewoon)* — Voor de opendeurdag. Serge wil er netjes bij lopen. | Haal 50 prestaties |
| **Baret** *(zeldzaam)* — Met kwastje. De ouders zijn trots. | Studeer één keer af |
| **Helm** *(zeldzaam)* — Voor als het plafond vol kabels naar beneden komt. | Los een incident op voor het uit de hand loopt |
| **Hoge hoed** *(zeldzaam)* — Ook in de serverruimte blijft hij een heer. | Koop honderd upgrades |
| **Regenwolkje** *(zeldzaam)* — Maandagochtend, en de printer doet het weer niet. | Negeer tien rode packets |
| **Schotelantenne** *(episch)* — Serge vangt het signaal op. Het signaal is Serge. | Koop een satellietconstellatie |
| **Lampje** *(episch)* — Er gaat een lampje branden. Af en toe. | Lees de hele cursus |
| **Kroon** *(legendarisch)* — Een kroon die fonkelt. Het netwerk is zijn koninkrijk. | Koop een singulariteit |
| **Feesthoedje** *(ongewoon)* — Met een pompon. Er is altijd wel iemand in de klas jarig. | Haal 20 prestaties |
| **Kattenoren** *(zeldzaam)* — Ze bewegen als er een packet binnenkomt. Serge ontkent alles. | Heb precies 42 exemplaren van één apparaat |
| **Propellerpet** *(zeldzaam)* — Voor wie overhoringen niet spannend genoeg vindt. Hij draait sneller als Serge nadenkt. | Beantwoord vijftig vragen goed bij de overhoring |
| **Ninjaband** *(zeldzaam)* — Hij komt, hij patcht, hij is weg. Niemand heeft hem gezien. | Typ een commando dat begint met sudo in de terminal |
| **Kerstmuts** *(zeldzaam)* — Ho ho ho. De switch ligt plat, maar het is gezellig. | Speel in december |
| **Heksenhoed** *(zeldzaam)* — In oktober configureert Serge alleen nog met toverspreuken. | Speel in oktober |
| **Vogeltje** *(episch)* — Hij bewoog tien minuten niet, en toen kwam er een vogeltje op zijn hoofd zitten. Het blijft. | Laat het spel tien minuten met rust |
| **Wifi-signaal** *(episch)* — Drie streepjes boven zijn hoofd. Vol bereik, tot in de kelder. | Rond 25 opdrachten af in de terminal |
| **Duizelig** *(episch)* — Sterretjes die rond zijn hoofd draaien. Er is te veel geklikt. | Klik vijftigduizend keer |
| **Duivelshoorns** *(episch)* — Voor wie rode packets laat liggen. Serge weet het. Serge ziet alles. | Negeer vijftig rode packets |
| **Ruimtehelm** *(legendarisch)* — Een glazen bol om zijn hoofd, voor het onderhoud aan de satellieten. | Bezit 50 satellietconstellaties |
| **Eenhoornhoorn** *(legendarisch)* — Een eenhoorn is een start-up van een miljard. Serge is er een van een triljoen. | Verdien in totaal een triljoen packets |
| **Vlammenkroon** *(mythisch)* — Zijn hoofd staat in brand en hij heeft het niet eens door. Zo hard werkt hij. | Bereik een biljard packets per seconde |
| **Aureool** *(mythisch)* — Een gouden ring boven zijn hoofd. Serge is heilig verklaard. | Koop elk knooppunt in de studieboom |
| **Planetenbaan** *(goddelijk)* — Drie planeten draaien rond zijn hoofd. Zo belangrijk is hij inmiddels. | Haal elke prestatie |
| **Koffiemok** *(ongewoon)* — Een dampende mok op zijn hoofd. Handig, dan hoeft hij niet op te staan. | Speel in totaal vier uur |
| **Routerhoed** *(zeldzaam)* — Een router met drie antennes en knipperende lampjes. Serge is een hotspot. | Bezit 150 core routers |
| **Onweerswolk** *(legendarisch)* — Een donderwolk die af en toe een bliksem laat vallen. Het netwerk ligt eruit, maar hij niet. | Zie 150 rode packets |

### Ring

| Ring | Hoe je hem vrijspeelt |
|---|---|
| **Blauw** *(gewoon)* — De vertrouwde rand. | Heb je vanaf het begin |
| **Goud** *(ongewoon)* — Voor de gouden-packetjager. | Klik 25 gouden packets |
| **Cyaan** *(ongewoon)* — De kleur van een werkende poort. | Zet een interface volledig goed op in de terminal |
| **Groen** *(ongewoon)* — Uit de patchkast. | Ontdek je eerste protocol |
| **Indigo** *(ongewoon)* — Voor wie het netwerk 's nachts laat doordraaien. | Kom terug na een uur weg te zijn geweest |
| **Alarmrood** *(ongewoon)* — Voor wie rode packets links laat liggen. | Negeer tien rode packets |
| **Roze** *(zeldzaam)* — Omdat het kan. | Haal 40 prestaties |
| **Wit** *(zeldzaam)* — Rustig, strak, klaar. | Bezit 500 apparaten tegelijk |
| **Terminalgroen** *(zeldzaam)* — De kleur van een console die het doet. | Typ de Konami-code |
| **Koper** *(zeldzaam)* — Warm en ouderwets, net als UTP. | Klik 200 gouden packets |
| **Radar** *(zeldzaam)* — Een straal die rondzwaait op zoek naar packets. | Typ ping in de terminal |
| **IJs** *(zeldzaam)* — Bevroren, met rijp op de rand. | Laat het spel tien minuten met rust |
| **Hartslag** *(zeldzaam)* — Klopt twee keer, rust, klopt twee keer. Het netwerk leeft. | Los een incident op voor het uit de hand loopt |
| **Mat zwart** *(episch)* — Zoals elk rack in elk datacenter. | Bezit 1.000 apparaten tegelijk |
| **Regenboog** *(episch)* — Een ring die alle kleuren doorloopt. | Studeer één keer af |
| **T568B** *(episch)* — De acht aders van een netwerkkabel, in de juiste volgorde. | Lever 25 werkorders op in de patchkast |
| **Pulsar** *(episch)* — Golven licht die telkens van de foto wegrollen. | Bereik tien miljoen packets per seconde |
| **Hoogspanning** *(episch)* — Vonken die rond de rand flitsen. Niet aanraken. | Bezit 50 datacenters tegelijk |
| **Satelliet** *(episch)* — Een klein lichtje in een baan om Serge. | Koop een satellietconstellatie |
| **Lichtpuls** *(legendarisch)* — Pulsen licht die rondjes draaien, zoals in een glasvezelring. | Ontdek alle protocollen in de patchkast |
| **Diamant** *(legendarisch)* — Harde facetten die het licht breken. | Haal 110 prestaties |
| **Vuurring** *(legendarisch)* — Een datacenter zonder koeling. | Bezit 2.000 apparaten tegelijk |
| **Plasma** *(mythisch)* — Een gloeiende ring die nooit stilstaat. | Verzamel 50 studiepunten |
| **Melkweg** *(mythisch)* — Een draaiend sterrenstelsel, met Serge in het midden. | Studeer 25 keer af |
| **Zonnekroon** *(goddelijk)* — Stralen van licht die langzaam om hem heen draaien. | Koop de hele studieboom en vind alles wat verborgen is |
| **Morse** *(zeldzaam)* — Streepjes en puntjes die ronddraaien. Er staat SERGE, als je het kunt lezen. | Rond vijftien opdrachten af in de terminal |
| **Glitchring** *(episch)* — Een ring die hapert en uit elkaar valt in rood en blauw. | Voer rm -rf / uit in de terminal |
| **Klok** *(legendarisch)* — Een wijzerplaat rond zijn hoofd, met een secondewijzer die nooit stopt. | Speel in totaal zestig uur |

### Houding

| Houding | Hoe je hem vrijspeelt |
|---|---|
| **Rustig** *(gewoon)* — Hij ademt rustig in en uit. Meer niet. | Heb je vanaf het begin |
| **Wiebelen** *(gewoon)* — Een beetje heen en weer, zoals iemand die op de bus wacht. | Klik honderd keer |
| **Meeknikken** *(ongewoon)* — Hij knikt mee op een beat die alleen hij hoort. | Klik vijfduizend keer |
| **Pudding** *(zeldzaam)* — Hij drilt na, alsof hij van gelatine is. Niemand weet waarom. | Klik vijftig gouden packets |
| **Dansen** *(zeldzaam)* — Heupen los. Het is vrijdagmiddag in het serverlokaal. | Verkoop tien keer met winst op de markt |
| **Draaitol** *(episch)* — Af en toe draait hij een rondje. Gewoon omdat het kan. | Bezit vijfhonderd apparaten tegelijk |
| **Cafeïne** *(episch)* — Acht koppen koffie op. Hij trilt, maar hij is er klaar voor. | Bereik het hoogste koffiepeil |
| **Haperen** *(episch)* — Af en toe verspringt hij, alsof de verbinding even wegvalt. | Vind acht verborgen dingen |
| **Stuiterbal** *(legendarisch)* — Hij stuitert op de maat, en plet een beetje als hij neerkomt. | Verdien in totaal een triljard packets |
| **Discokoorts** *(legendarisch)* — Hij danst, en de kleuren dansen mee. | Studeer tien keer af |
| **Zen** *(mythisch)* — Diep in, diep uit. Er straalt een zacht licht van hem af. | Speel in totaal 72 uur |
| **Hypnose** *(goddelijk)* — Hij slingert als een zakhorloge. Je wordt heel slaperig. Je wilt alleen nog klikken. | Speel 300 dingen vrij bij Uiterlijk |
| **Slaperig** *(ongewoon)* — Hij knikt af en toe weg. Het is ook al laat. | Speel tussen drie en vier uur 's nachts |
| **Headbangen** *(zeldzaam)* — Knikken op een hard ritme. Het is metal, of een ventilator die vastloopt. | Klik een reeks van honderd |
| **Moonwalk** *(episch)* — Hij glijdt achteruit en weer terug, zonder zijn voeten te bewegen. | Klik 250.000 keer |

### Omloop

| Omloop | Hoe je hem vrijspeelt |
|---|---|
| **Niets** *(gewoon)* — Serge draait zijn eigen rondjes niet. | Heb je vanaf het begin |
| **Muisjes** *(gewoon)* — Muisaanwijzers die om de beurt op Serge tikken. Hij merkt het niet eens. | Klik duizend keer |
| **Packets** *(gewoon)* — Envelopjes die in een baan om Serge wachten op hun beurt. | Bezit vijftig apparaten tegelijk |
| **Bits** *(ongewoon)* — Nullen en enen in een kring, alsof hij in een stroomkring staat. | Verdien in totaal een miljard packets |
| **Hartjes** *(ongewoon)* — Iedereen houdt van Serge. Zelfs zijn baan. | Klik tien keer precies op zijn neus |
| **Satellieten** *(zeldzaam)* — Zijn eigen constellatie. Het bereik is uitstekend. | Bezit tien satellietconstellaties |
| **Koffiekringetje** *(zeldzaam)* — De mokken draaien rondjes. Er is er altijd een binnen handbereik. | Bereik het hoogste koffiepeil |
| **Elektronen** *(episch)* — Drie banen, zoals een atoom. Serge is de kern van de zaak. | Bezit 25 Quantum Links |
| **Goudstukken** *(episch)* — Draaiende munten. Ze glanzen elke keer als ze voorbij komen. | Klik vierhonderd gouden packets |
| **Mini-Serges** *(legendarisch)* — Een fanclub van kleine Serges die rond de grote draaien. | Typ zijn naam, gewoon op je toetsenbord |
| **Kometen** *(mythisch)* — Kometen met een lange staart, op hoge snelheid. | Speel in totaal 120 uur |
| **Zonnestelsel** *(goddelijk)* — Serge is de zon. Acht planeten, elk op zijn eigen tempo. Het klopt nu eindelijk. | Bezit honderd singulariteiten |
| **Muzieknootjes** *(ongewoon)* — Noten die rond hem zweven. Hij neuriet iets. Niemand herkent het. | Klik vijftienduizend keer |
| **Linux-fans** *(zeldzaam)* — Pinguïns die rond hem waggelen. Ze willen dat hij overstapt. | Bezit vijftig Proxmox-clusters |
| **Vuurvliegjes** *(episch)* — Lichtjes die rond hem zweven en aan- en uitgaan. | Wees om 13:37 in het spel |

### Decor

| Decor | Hoe je hem vrijspeelt |
|---|---|
| **Niets** *(gewoon)* — Geen decor, alleen Serge. | Heb je vanaf het begin |
| **Spot aan** *(gewoon)* — Een zachte spot van achteren. Hij staat in de schijnwerpers. | Koop 25 upgrades |
| **Zonnestralen** *(ongewoon)* — Stralen die langzaam ronddraaien, zoals bij een prijs in een spel. | Studeer één keer af |
| **Sonar** *(ongewoon)* — Ringen die van hem wegrollen. Ping. Ping. Ping. | Typ ping in de terminal |
| **Neonring** *(zeldzaam)* — Een roze en blauwe neonbuis achter hem. Hij zoemt. | Haal 55 prestaties |
| **Discolicht** *(zeldzaam)* — Gekleurde vlekken die over de muur draaien. | Studeer twee keer af |
| **Vuurzee** *(episch)* — Hij staat voor een muur van vlammen en kijkt niet om. | Bezit duizend apparaten tegelijk |
| **Sterrenstelsel** *(legendarisch)* — Een draaiend sterrenstelsel, met Serge in het midden. | Bezit honderd Hyperscaler-regio's |
| **Zwart gat** *(legendarisch)* — Een gloeiende schijf die rondraast. Alles valt naar hem toe. | Bezit vijf singulariteiten |
| **Portaal** *(mythisch)* — Een kolkende poort naar een ander netwerk. | Bezit vijftig Parallel VPN's |
| **Stralenkrans** *(goddelijk)* — Gouden stralen, een zachte gloed en glinsters. Het is officieel. | Verzamel 4.000 studiepunten |
| **Regenboog** *(ongewoon)* — Een regenboog van achteren, als een stralenkrans in alle kleuren. | Haal 35 prestaties |
| **Sterrenhemel** *(zeldzaam)* — Een stukje nachthemel achter hem, met sterren die twinkelen. | Bezit 25 satellietconstellaties |
| **Tunnel** *(episch)* — Ringen die naar je toe schieten, alsof je door een glasvezel reist. | Bezit vijftig Dark Fiber Meshes |

### Maatje

| Maatje | Hoe je hem vrijspeelt |
|---|---|
| **Geen maatje** *(gewoon)* — Serge werkt liever alleen. | Heb je vanaf het begin |
| **Hamster** *(gewoon)* — Houdt het datacenter draaiende, in zijn wieltje. | Klik honderd keer |
| **Badeendje** *(ongewoon)* — Leg je probleem uit aan de eend, en je lost het zelf op. | Voer je eerste commando uit in de terminal |
| **Paperclip** *(ongewoon)* — Een oude bekende uit de kantoorsoftware. Hij wil zo graag helpen. | Lees een hoofdstuk van de cursus |
| **Serverkat** *(zeldzaam)* — Slaapt op de warmste switch van het gebouw. | Bezit honderd apparaten tegelijk |
| **Python** *(zeldzaam)* — Een slang die alles in één regel oplost. Meestal. | Rond tien opdrachten in de terminal af |
| **Printer** *(zeldzaam)* — De vijand van elke netwerkbeheerder. Hij weet het. | Los een incident op voor het uit de hand loopt |
| **De Bug** *(zeldzaam)* — Zat al in de eerste versie, en is nooit weggegaan. | Klik 25 keer op de logbalk onder Serge |
| **Botje** *(episch)* — Een handelsrobot met te veel zelfvertrouwen. | Laat een winstorder of verliesgrens voor je verkopen |
| **Tux** *(episch)* — Draait op alles, behalve op dinsdag. | Typ een commando met sudo in de terminal |
| **Spook** *(episch)* — Het spook in de machine. Woont in poort 24. | Laat het spel tien minuten met rust |
| **Docker-walvis** *(episch)* — Draagt honderd containers op zijn rug, en klaagt nooit. Bijna nooit. | Bezit 50 Kubernetes-clusters tegelijk |
| **Koffiemok** *(episch)* — Een mok met oogjes. Altijd halfvol. | Haal 90 prestaties |
| **Nachtuil** *(legendarisch)* — Wakker als de backups draaien. | Speel tussen drie en vier uur 's nachts |
| **Invader** *(legendarisch)* — Kwam binnen via poort 1337. | Typ de Konami-code |
| **Startup-eenhoorn** *(legendarisch)* — Een miljard waard, op papier. Vooral op papier. | Verdien een fortuin op de markt in één sessie |
| **Legacy-draak** *(mythisch)* — Bewaakt een server uit 1998 waar niemand meer aan durft te komen. | Verzamel 250 studiepunten |
| **Mini-Serge** *(goddelijk)* — Een kleine Serge die alles ziet. Echt alles. | Verzamel 1.000 studiepunten |
| **Muis** *(ongewoon)* — Zijn trouwste werktuig. Hij heeft er meer van gezien dan jij. | Klik 2.500 keer |
| **Diskette** *(zeldzaam)* — Een diskette van 1,44 MB die nog altijd denkt dat ze belangrijk is. | Koop 75 upgrades |
| **Wolkje** *(episch)* — De cloud, in het klein. Ze zweeft naast Serge en weet alles van hem. | Bezit 25 Hyperscaler-regio's |

### Achtergrond

| Achtergrond | Hoe je hem vrijspeelt |
|---|---|
| **Klaslokaal** *(gewoon)* — Het vertrouwde blauw. | Heb je vanaf het begin |
| **Mint** *(gewoon)* — Koel en fris, als een goed gekoelde gang. | Verdien in totaal een miljoen packets |
| **Vroege dienst** *(ongewoon)* — Geel en roze, van voor de koffie. | Klik tienduizend keer |
| **Koper** *(ongewoon)* — Warm, ouderwets en betrouwbaar. | Koop 50 upgrades |
| **Zonsondergang** *(ongewoon)* — Roze tot paars, na een goede handelsdag. | Maak winst op de bandbreedtemarkt |
| **Serverlokaal** *(zeldzaam)* — Donker, koel en groen verlicht. | Tien goede antwoorden op rij bij de overhoring |
| **Patchkast** *(zeldzaam)* — Het groen van een volle kabelgoot. | Ontdek vier protocollen |
| **Matrix** *(zeldzaam)* — Digitale regen, zwart met groen. Je weet waarom. | Voer rm -rf / uit in de terminal |
| **Blokjes** *(zeldzaam)* — Vallende blokken die netjes op elkaar landen. Eén rij vol, en weg is hij. | Typ de Konami-code |
| **Staal** *(episch)* — Grijs op grijs, zoals het rack zelf. | Haal 100 prestaties |
| **Oceaan** *(episch)* — Diep water, met een kabel erdoorheen. | Koop je eerste zeekabel |
| **Nevel** *(episch)* — Paars en stil, ergens ver weg. | Verzamel 25 studiepunten |
| **Regenboog** *(episch)* — Alles tegelijk. Niet subtiel, wel verdiend. | Studeer één keer af |
| **Glasvezel** *(episch)* — Lichtpulsen die door donkere vezels schieten. | Bezit 200 glasvezels tegelijk |
| **Synthwave** *(episch)* — Een neonraster dat naar de zon rijdt. Het is altijd 1986. | Vind tien verborgen dingen |
| **Lavalamp** *(episch)* — Grote warme bellen die traag stijgen en zakken. | Speel in totaal 24 uur |
| **Aquarium** *(episch)* — Vissen die rustig langs zwemmen. Iemand moet ze voeren. | Bezit 25 zeekabels tegelijk |
| **Diepe ruimte** *(legendarisch)* — Voorbij de laatste satelliet. | Koop je eerste singulariteit |
| **Noorderlicht** *(legendarisch)* — Groen en violet licht dat traag over de hemel golft. | Lever twintig werkorders luchtdicht op |
| **Datacenter** *(legendarisch)* — Een koude gang tussen de racks, vol knipperende lampjes. | Bezit 100 serverracks tegelijk |
| **Zeebodem** *(legendarisch)* — Een zeekabel op de bodem, met licht dat erdoor pulst en bellen die opstijgen. | Bezit 50 zeekabels tegelijk |
| **Netwerkkaart** *(legendarisch)* — Een levend netwerk: knooppunten, lijnen en packets die erover reizen. | Studeer vijf keer af |
| **Meteorenregen** *(legendarisch)* — Een sterrenhemel waar telkens een vallende ster doorheen schiet. | Bezit 100 satellietconstellaties tegelijk |
| **Warpsprong** *(mythisch)* — Sterren die langs je heen schieten. Volle kracht vooruit. | Koop een Parallel VPN |
| **Vuurwerk** *(mythisch)* — Pijlen die opstijgen en openbarsten in alle kleuren. | Speel op oudejaarsavond of nieuwjaarsdag, of studeer vijftien keer af |
| **Heelal** *(goddelijk)* — Een spiraalstelsel dat langzaam om zijn kern draait. | Bezit honderd singulariteiten tegelijk |
| **Tropisch** *(ongewoon)* — Een gele zon die in een turquoise zee zakt. Vakantie, maar dan met packets. | Bezit driehonderd apparaten tegelijk |
| **Printplaat** *(zeldzaam)* — Groene sporen en soldeerpunten, zoals de binnenkant van een switch. | Lever tien werkorders luchtdicht op |
| **Zonsverduistering** *(mythisch)* — De maan schuift voor de zon, en een gloeiende krans licht op in een donkere hemel. | Studeer 35 keer af |

### Panelen

| Panelen | Hoe je hem vrijspeelt |
|---|---|
| **Wit** *(gewoon)* — Licht en rustig, met een vleugje van je achtergrond bovenaan. | Heb je vanaf het begin |
| **Ruitjespapier** *(gewoon)* — Een schrift uit de klas, met een rode kantlijn. | Lees een hoofdstuk van de cursus |
| **Matglas** *(ongewoon)* — Doorschijnend, zodat je achtergrond overal doorheen schemert. | Verdien in totaal tien miljoen packets |
| **Nachtdienst** *(ongewoon)* — Donkerblauw, voor wie tot laat in het serverlokaal zit. | Speel in totaal vijf uur |
| **Prikbord** *(ongewoon)* — Kurk met punaises, zoals het bord in de leraarskamer. | Haal 25 prestaties |
| **Krijtbord** *(zeldzaam)* — Het groene bord van het lokaal, in een houten lijst. | Tien goede antwoorden op rij bij de overhoring |
| **Blauwdruk** *(zeldzaam)* — Het netwerk als bouwtekening, met ruitjes en witte lijnen. | Bezit vijfhonderd apparaten tegelijk |
| **Windows 95** *(zeldzaam)* — Grijze vensters met een blauwe titelbalk. Klik op Start. | Rechtsklik tien keer op Serge |
| **Beeldbuis** *(zeldzaam)* — Groen fosfor op zwart, met scanlijnen die langzaam zakken. | Typ cisco in de terminal |
| **Neon** *(episch)* — Zwart met een gloeiende rand, zoals een gamingkast. | Klik vijfhonderd gouden packets |
| **Regenboogrand** *(episch)* — Een rand die rustig alle kleuren doorloopt. | Studeer drie keer af |
| **Magma** *(episch)* — Donkerrood, met een rand die gloeit als lava. | Negeer honderd rode packets |
| **IJspaleis** *(episch)* — Bevroren glas met glinsters die even oplichten. | Speel in totaal 48 uur |
| **Gouden kluis** *(legendarisch)* — Zwart en goud, voor wie het allemaal al gezien heeft. | Studeer tien keer af |
| **Aurora** *(legendarisch)* — Noorderlicht dat traag achter de tekst langs golft. | Lever 45 werkorders op in de patchkast |
| **Hologram** *(legendarisch)* — Doorschijnend cyaan, met scanlijnen en af en toe een hapering. | Bereik een biljoen packets per seconde |
| **Sterrennacht** *(mythisch)* — Een diepblauwe hemel vol sterren die zachtjes twinkelen. | Studeer twintig keer af |
| **Hemelpoort** *(goddelijk)* — Wit en goud, met licht dat er traag doorheen trekt. | Speel in totaal 200 uur |
| **Papier** *(ongewoon)* — Gebroken wit, zoals een cursus die net van de printer komt. | Lees de hele cursus |
| **Koffiebar** *(zeldzaam)* — Donkerbruin met romige letters. Het ruikt hier naar espresso. | Speel in totaal tien uur |

### Accentkleur

| Accentkleur | Hoe je hem vrijspeelt |
|---|---|
| **Blauw** *(gewoon)* — Het blauw van altijd. | Heb je vanaf het begin |
| **Paars** *(gewoon)* — Voor wie ook eens iets anders wil. | Koop tien upgrades |
| **Groen** *(gewoon)* — De kleur van een poort die up is. | Bezit 25 patchkabels |
| **Turkoois** *(ongewoon)* — Koel en fris, zoals de lucht uit de airco van het datacenter. | Verdien in totaal een miljoen packets |
| **Oranje** *(ongewoon)* — Warm, zoals een switch die net iets te hard werkt. | Koop 75 upgrades |
| **Roze** *(zeldzaam)* — Serge vindt het ook mooi. Hij zegt het alleen niet. | Klik tien keer precies op zijn neus |
| **Rood** *(zeldzaam)* — Alarmfase rood, de hele dag. | Negeer 25 rode packets |
| **Goud** *(episch)* — Alles wat je aanraakt wordt goud. Ook de knoppen. | Klik 750 gouden packets |
| **Inkt** *(episch)* — Zwart op wit, zoals een oude laserprinter. | Ontdek elk protocol in de patchkast |
| **Regenboog** *(legendarisch)* — De accentkleur schuift langzaam door de hele regenboog. | Studeer twaalf keer af |
| **Neon** *(mythisch)* — Roze knoppen en cyaan balken. Het is altijd 1986. | Bezit 100 AI NetOps |
| **Oceaan** *(ongewoon)* — Diep zeeblauw, zoals een zeekabel op de bodem. | Bezit tien zeekabels |
| **Bordeaux** *(zeldzaam)* — Donkerrood, zoals een goede wijn op de opendeurdag. | Studeer drie keer af |
| **Aurora** *(goddelijk)* — De accentkleur golft traag tussen groen, turkoois en violet, zoals het noorderlicht. | Speel in totaal 250 uur |

### Weer

| Weer | Hoe je hem vrijspeelt |
|---|---|
| **Helder** *(gewoon)* — Niets in de lucht. | Heb je vanaf het begin |
| **Regen** *(ongewoon)* — Schuine strepen regen tegen het raam van het serverlokaal. | Los een incident op voor het uit de hand loopt |
| **Packetstorm** *(ongewoon)* — Kleine enveloppen die omhoog dwarrelen, op weg naar het internet. | Verdien in totaal honderd miljoen packets |
| **Sneeuw** *(zeldzaam)* — Dikke vlokken die traag naar beneden dwarrelen. | Speel in december, januari of februari |
| **Bloesem** *(zeldzaam)* — Roze blaadjes op de wind. | Speel in maart, april of mei |
| **Vlinders** *(zeldzaam)* — Zomerse vlinders die van hier naar daar fladderen. | Speel in juni, juli of augustus |
| **Herfstbladeren** *(zeldzaam)* — Oranje en rode bladeren die rondtollend naar beneden vallen. | Speel in september, oktober of november |
| **Binaire sneeuw** *(zeldzaam)* — Nullen en enen die zachtjes naar beneden vallen. | Typ no shutdown op een interface die al aanstaat |
| **Vuurvliegjes** *(episch)* — Kleine lichtjes die rondzweven en aan- en uitgaan. | Wees om 13:37 in het spel |
| **Confetti** *(episch)* — Een feest dat nooit ophoudt. | Studeer vijf keer af |
| **Vallende sterren** *(legendarisch)* — Sterren die in lange strepen door de lucht schieten. Doe een wens. | Vind vijftien verborgen dingen |
| **Gouden regen** *(goddelijk)* — Gouden glinsters die neerdalen en even oplichten. | Klik 5.000 gouden packets |
| **Mist** *(ongewoon)* — Zachte slierten die over het scherm drijven. Waar is dat serverlokaal ook alweer? | Negeer vijf rode packets |
| **Ballonnen** *(zeldzaam)* — Kleurige ballonnen die opstijgen. Er is altijd iets te vieren. | Haal 65 prestaties |
| **Onweer** *(mythisch)* — Harde regen, en af en toe licht het hele scherm op. | Zie driehonderd rode packets |

### Filter

| Filter | Hoe je hem vrijspeelt |
|---|---|
| **Geen filter** *(gewoon)* — Het beeld zoals het is. | Heb je vanaf het begin |
| **Vignet** *(ongewoon)* — Donkere randen, zodat alle aandacht naar het midden gaat. | Speel in totaal een uur |
| **Avondlicht** *(ongewoon)* — Een warme gloed, beter voor je ogen als het laat wordt. | Speel 's avonds na negen uur |
| **Oude foto** *(zeldzaam)* — Alles in sepia, alsof het spel al jaren in een album zit. | Koop 25 upgrades |
| **Beeldbuis** *(zeldzaam)* — Fijne lijnen over alles, zoals op een oude monitor. | Vind drie verborgen dingen |
| **Filmkorrel** *(zeldzaam)* — Alsof het hele spel op 16 millimeter is gedraaid. | Haal 45 prestaties |
| **Videoband** *(episch)* — Een oude VHS-band, met een storingsbalk die door het beeld rolt. | Speel in totaal zes uur |
| **Nachtkijker** *(episch)* — Alles groen, zoals in een spionagefilm. | Speel tussen drie en vier uur 's nachts |
| **Zakcomputer** *(legendarisch)* — Vier tinten groen en een raster van pixels, zoals een spelcomputer uit 1989. | Vind twaalf verborgen dingen |
| **Onderwater** *(mythisch)* — Lichtvlekken die over alles heen dansen, alsof het rack in zee ligt. | Bezit 100 zeekabels tegelijk |
| **Hologramfolie** *(goddelijk)* — Een glanzende folie over het hele scherm, zoals op een zeldzame ruilkaart. | Studeer dertig keer af |
| **Pastel** *(ongewoon)* — Alles zachter en een tikje roze, alsof het spel pas gewassen is. | Koop vijftien upgrades |
| **Cyberpunk** *(episch)* — Magenta en cyaan, zoals een stad die nooit slaapt. | Bezit 25 AI NetOps |
| **Prisma** *(legendarisch)* — Het licht breekt aan de randen van het scherm in alle kleuren. | Klik drieduizend gouden packets |

### Packet

| Packet | Hoe je hem vrijspeelt |
|---|---|
| **Gouden schijf** *(gewoon)* — Goud, met een doos erop, zoals altijd. | Heb je vanaf het begin |
| **Cadeautje** *(ongewoon)* — Met een strik erom. Wat erin zit, weet je pas als je klikt. | Klik 25 gouden packets |
| **Munt** *(ongewoon)* — Een gouden munt met een S erop, die ronddraait. | Klik 50 gouden packets |
| **Diskette** *(zeldzaam)* — 1,44 MB aan pure winst. | Koop 50 upgrades |
| **Ster** *(zeldzaam)* — Een gouden ster die langzaam draait. | Klik 150 gouden packets |
| **Pizza** *(zeldzaam)* — Vrijdagmiddag in de leraarskamer. | Haal 70 prestaties |
| **Serverkat** *(episch)* — Hij lag er al. Hij gaat niet weg. | Heb precies 42 exemplaren van één apparaat |
| **Diamant** *(episch)* — Harde facetten, en het licht breekt erin. | Klik vijfhonderd gouden packets |
| **Mini-Serge** *(legendarisch)* — Serge zelf, verguld. Klik hem voor hij wegloopt. | Klik duizend gouden packets |
| **Zonnetje** *(mythisch)* — Een kleine zon met stralen die ronddraaien. | Klik 2.500 gouden packets |
| **Regenboogpacket** *(goddelijk)* — Een packet in alle kleuren. Wat erin zit, weet niemand. | Klik 5.000 gouden packets |
| **Envelop** *(ongewoon)* — Een brief met een lakzegel. Er staat je naam op. | Klik 35 gouden packets |
| **Koekje** *(zeldzaam)* — Een knipoog naar een ander klikspel. Serge ontkent dat hij het kent. | Klik dertigduizend keer |
| **Vliegende schotel** *(episch)* — Hij zweeft voorbij en neemt je packets mee. Of brengt hij ze? | Bezit 75 satellietconstellaties |

### Opstart

| Opstart | Hoe je hem vrijspeelt |
|---|---|
| **Meteen spelen** *(gewoon)* — Geen gedoe, meteen Serge. | Heb je vanaf het begin |
| **Switch-opstart** *(ongewoon)* — Het spel start op als een switch: bootstrap, flash laden, en dan de vraag of je op Enter wilt drukken. | Voer je eerste commando uit in de terminal |
| **BIOS** *(zeldzaam)* — Een geheugentest, een piepje, en een lijst met schijven die gevonden worden. | Vind de verborgen console |
| **Munt erin** *(zeldzaam)* — Een speelhal uit 1987. Er knippert iets: druk op start. | Klik vijftig keer op het grote getal bovenaan |
| **Serge 95** *(episch)* — Wolkjes, een laadbalk en een geluid dat je niet vergeet. | Rechtsklik tien keer op Serge |
| **Bioscoop** *(legendarisch)* — Serge Studios presenteert. Een film over packets. In de hoofdrol: jij. | Studeer twintig keer af |
| **Hemelpoort** *(goddelijk)* — De wolken schuiven open, het licht valt naar binnen, en Serge ontwaakt. | Behaal het doctoraat in de studieboom |
| **DOS** *(ongewoon)* — C:\> met een knipperend streepje, en dan start SERGE.EXE. | Rond vijf opdrachten af in de terminal |
| **Spelconsole** *(zeldzaam)* — Een blauw logo dat opzij schuift, en iemand die heel luid de naam roept. | Klik 75.000 keer |
| **Word wakker** *(mythisch)* — Word wakker, Serge. Het netwerk heeft je. Volg de witte muis. | Vind zestien verborgen dingen |

### Teller

| Teller | Hoe je hem vrijspeelt |
|---|---|
| **Donkerblauw** *(gewoon)* — Rustig en goed leesbaar. | Heb je vanaf het begin |
| **Rekenmachine** *(ongewoon)* — Groene cijfers op een zwart schermpje. | Verdien in totaal honderd miljoen packets |
| **Goud** *(zeldzaam)* — Elk getal is een trofee. | Klik honderd gouden packets |
| **Neon** *(zeldzaam)* — Roze neonbuizen, en ze zoemen zachtjes. | Haal 60 prestaties |
| **Arcade** *(zeldzaam)* — Zoals de highscore in een speelhal. | Typ de Konami-code |
| **Matrix** *(episch)* — Groene cijfers die zachtjes gloeien. | Voer rm -rf / uit in de terminal |
| **Regenboog** *(episch)* — Elk cijfer in een andere kleur, en ze schuiven door. | Studeer vijf keer af |
| **IJs** *(episch)* — Bevroren cijfers met een koude gloed. | Speel in totaal 48 uur |
| **Vuur** *(legendarisch)* — Het getal is zo hoog dat het brandt. | Bereik een biljoen packets per seconde |
| **Hologram** *(legendarisch)* — Doorschijnend, met scanlijnen door de cijfers. | Bereik een miljard packets per seconde |
| **Kosmisch** *(mythisch)* — Cijfers vol sterrenstelsels. | Speel in totaal honderd uur |
| **Hemels** *(goddelijk)* — Wit goud met een gloed die ademt. | Verzamel 3.000 studiepunten |
| **Krijtbord** *(ongewoon)* — Witte krijtcijfers op een groen bord. Er is net nog iets uitgeveegd. | Lees twee hoofdstukken van de cursus |
| **Scorebord** *(episch)* — Klapcijfers zoals op een oud station. Elk cijfer in een eigen vakje. | Verdien in totaal een biljard packets |
| **Chroom** *(legendarisch)* — Glanzend metaal, zoals op een oude sportwagen. | Bezit vierduizend apparaten tegelijk |

### Eenheid

| Eenheid | Hoe je hem vrijspeelt |
|---|---|
| **Packets** *(gewoon)* — Pakketten op laag 3, zoals het hoort. | Heb je vanaf het begin |
| **Frames** *(gewoon)* — Laag 2: wat een switch doorstuurt. | Beantwoord vijf vragen goed bij de overhoring |
| **Bits** *(gewoon)* — Laag 1: nullen en enen, meer is het niet. | Beantwoord tien vragen goed bij de overhoring |
| **Segmenten** *(ongewoon)* — Laag 4: TCP knipt alles in stukjes. | Beantwoord 25 vragen goed bij de overhoring |
| **Datagrammen** *(ongewoon)* — UDP: versturen en hopen dat het aankomt. | Rond tien opdrachten af in de terminal |
| **Bytes** *(ongewoon)* — Acht bits per stuk. Serge telt ze allemaal. | Verdien in totaal een biljoen packets |
| **Pakketjes** *(zeldzaam)* — Met een strik. De koerier belt twee keer. | Lever 25 werkorders op in de patchkast |
| **Koffiebonen** *(zeldzaam)* — De echte brandstof van elk netwerk. | Bereik het hoogste koffiepeil |
| **Sergecoins** *(episch)* — Een munt die alleen maar stijgt. Beloofd. | Koop op een gerucht dat uitkomt, en verkoop met winst |
| **Pizzapunten** *(episch)* — Voor elke pizza in de leraarskamer een punt. | Speel in totaal twintig uur |
| **Memes** *(legendarisch)* — De leerlingen sturen ze door. Serge maakt ze. | Vind achttien verborgen dingen |
| **Fotonen** *(mythisch)* — Licht, per seconde. Sneller wordt het niet. | Verdien in totaal een quadriljard packets |
| **Wonderen** *(goddelijk)* — Serge verricht wonderen. Per seconde. | Speel 400 dingen vrij bij Uiterlijk |
| **Likes** *(ongewoon)* — Serge gaat viraal. Per seconde. | Haal 25 prestaties |
| **Cookies** *(zeldzaam)* — Een knipoog naar een ander klikspel. Deze cookies accepteer je wel. | Klik dertigduizend keer |
| **Dino's** *(episch)* — Zo lang speel je al. Je bent zelf een dino geworden. | Speel in totaal vijftig uur |

### Voortgang

| Voortgang | Hoe je hem vrijspeelt |
|---|---|
| **Blauwe balk** *(gewoon)* — Een dunne blauwe balk. | Heb je vanaf het begin |
| **Streepjes** *(gewoon)* — Schuine strepen die blijven lopen, zoals een echte laadbalk. | Koop vijf upgrades |
| **Laadblokjes** *(ongewoon)* — Blokje per blokje, zoals een installatie uit 1995. | Bezit 150 apparaten tegelijk |
| **Batterij** *(ongewoon)* — Van rood naar groen, en hij laadt op. | Speel in totaal drie uur |
| **Glasvezel** *(zeldzaam)* — Een lichtpuls die door de balk schiet. | Bezit honderd glasvezels |
| **Slang** *(zeldzaam)* — Een slang die groeit tot aan je volgende aankoop. | Typ hackerman, gewoon op je toetsenbord |
| **Happertje** *(episch)* — Een geel mannetje eet de stippen op weg naar je volgende aankoop. | Klik 350 gouden packets |
| **Regenboog** *(episch)* — Alle kleuren, en ze lopen door. | Studeer zes keer af |
| **Lava** *(legendarisch)* — Gloeiende lava met belletjes die opborrelen. | Bezit drieduizend apparaten tegelijk |
| **Sterrenstof** *(mythisch)* — Een balk vol sterren die flonkeren. | Bezit honderd Dyson-datacenters |
| **Hemelse balk** *(goddelijk)* — Een straal van licht, met glinsters erin. | Verzamel 5.000 studiepunten |
| **Patchkabel** *(ongewoon)* — Een blauwe kabel met een stekker aan het eind, op weg naar de volgende poort. | Lever je eerste werkorder op in de patchkast |
| **Treintje** *(zeldzaam)* — Een locomotief die wagonnetjes trekt naar je volgende aankoop. Tjoek tjoek. | Lever vijftig werkorders op |
| **Raket** *(episch)* — Een raket met een vlammende staart. Volgende halte: de volgende aankoop. | Koop een satellietconstellatie |

### Grafiek

| Grafiek | Hoe je hem vrijspeelt |
|---|---|
| **Blauwe lijn** *(gewoon)* — Een lijn met een vlak eronder, zoals elke monitoringpagina. | Heb je vanaf het begin |
| **Staafjes** *(gewoon)* — Elke paar seconden een staaf. | Bereik duizend packets per seconde |
| **Schrift** *(ongewoon)* — Met potlood op ruitjespapier, zoals in de les. | Lees drie hoofdstukken van de cursus |
| **Oscilloscoop** *(ongewoon)* — Een groene lijn die gloeit op een zwart scherm. | Bereik een miljoen packets per seconde |
| **Hartmonitor** *(zeldzaam)* — Piep. Piep. Serge leeft nog, en zijn netwerk ook. | Los een incident op voor het uit de hand loopt |
| **Neon** *(zeldzaam)* — Een roze lijn op een donkerpaars scherm. | Wees om 13:37 in het spel |
| **Beurskoers** *(episch)* — Kaarsjes, groen en rood, zoals op de markt. | Verdien een fortuin op de markt in één sessie |
| **Regenboog** *(episch)* — Een lijn in alle kleuren. | Studeer acht keer af |
| **Vuurlijn** *(legendarisch)* — De grafiek staat in brand van het verkeer. | Bereik tien biljoen packets per seconde |
| **Sterrenbeeld** *(mythisch)* — Je productie als sterrenbeeld aan een nachtelijke hemel. | Bezit tweehonderd satellietconstellaties |
| **Gouden grafiek** *(goddelijk)* — Een gouden vlak met licht erin. | Koop elk knooppunt in de studieboom |
| **Bergketen** *(ongewoon)* — Je productie als bergen, met sneeuw op de toppen. | Bezit vijftig core routers |
| **Aquarium** *(zeldzaam)* — Een bak water die volloopt met je productie, en belletjes die opstijgen. | Bezit vijftig zeekabels |
| **8-bit** *(episch)* — Een lijn in trapjes, groen op zwart, zoals een spel uit 1985. | Vind zes verborgen dingen |

### Rack

| Rack | Hoe je hem vrijspeelt |
|---|---|
| **Blokjes** *(gewoon)* — Een blokje per apparaat, in de kleur van zijn vak. | Heb je vanaf het begin |
| **Ledjes** *(gewoon)* — Ronde lampjes die knipperen, elk op zijn eigen tempo. | Bezit vijftig patchkabels |
| **Bouwsteentjes** *(ongewoon)* — Met noppen erop. Je kunt er een netwerk mee bouwen. | Bezit honderd exemplaren van één apparaat |
| **Stekkers** *(ongewoon)* — Een rij netwerkstekkers, netjes naast elkaar. | Lever een werkorder luchtdicht op |
| **Equalizer** *(zeldzaam)* — Staafjes die op en neer dansen, alsof je netwerk muziek maakt. | Klik twintigduizend keer |
| **Pixels** *(zeldzaam)* — Blokkerige pixels met een harde rand, zoals in 1985. | Ontdek het Token Ring-protocol |
| **Diskettes** *(zeldzaam)* — Elk apparaat staat op een eigen diskette. | Koop negentig upgrades |
| **Neonbuisjes** *(episch)* — Gloeiende buisjes in de kleur van hun vak. | Speel in totaal dertig uur |
| **Kristallen** *(episch)* — Geslepen stenen die schitteren. | Bezit vijftig Quantum Links |
| **Lavalampjes** *(legendarisch)* — Blobjes die traag van vorm veranderen. | Bezit vijfduizend apparaten tegelijk |
| **Sterretjes** *(mythisch)* — Elk apparaat een ster, en ze twinkelen. | Bezit 75 singulariteiten |
| **Goudstaafjes** *(goddelijk)* — Massief goud, met een glans die erover trekt. | Klik tienduizend gouden packets |
| **Boekenplank** *(ongewoon)* — Elk apparaat een boek op de plank, in de kleur van zijn vak. | Lees vier hoofdstukken van de cursus |
| **Snoepjes** *(zeldzaam)* — Ingepakte snoepjes. Niet opeten, het zijn je servers. | Klik 75 gouden packets |
| **Batterijen** *(episch)* — Elk apparaat een batterij die langzaam oplaadt. | Bezit tien Dyson-datacenters |

### Logo

| Logo | Hoe je hem vrijspeelt |
|---|---|
| **Serge Clicker** *(gewoon)* — Het logo zoals het hoort. | Heb je vanaf het begin |
| **Kapitalen** *(gewoon)* — In hoofdletters. Serge roept. | Klik duizend keer |
| **Handtekening** *(ongewoon)* — Met de hand gezet, zoals onder een rapport. | Koop tien upgrades |
| **Prompt** *(ongewoon)* — De prompt van een switch die klaar is voor je commando. | Voer je eerste commando uit in de terminal |
| **Enterprise** *(ongewoon)* — Nu met licentiekosten per packet. | Maak winst op de bandbreedtemarkt |
| **Serge.exe** *(zeldzaam)* — Serge.exe reageert niet meer. Wil je wachten? | Rechtsklik tien keer op Serge |
| **L33t** *(zeldzaam)* — Voor wie elite is. Of denkt dat te zijn. | Heb precies 1337 packets |
| **Tokio** *(zeldzaam)* — Serge heeft fans in Japan. Veel fans. | Tien goede antwoorden op rij bij de overhoring |
| **Latijn** *(zeldzaam)* — Ave Sergius. Wie gaan klikken, groeten u. | Studeer één keer af |
| **Stadiongolf** *(episch)* — Elke letter springt op zijn beurt op, zoals een wave in een stadion. | Klik tienduizend keer |
| **Neonreclame** *(episch)* — Boven de ingang van het datacenter. Eén woord hapert. | Speel in totaal twaalf uur |
| **Heavy metal** *(episch)* — Met umlauts, want dan gaat het sneller. | Haal 80 prestaties |
| **Regenboog** *(episch)* — Alle kleuren, en ze lopen door. | Studeer drie keer af |
| **Glitch** *(episch)* — Het logo is kapot. Of juist heel mooi. | Voer rm -rf / uit in de terminal |
| **In vuur en vlam** *(legendarisch)* — Het logo staat in brand. De koeling ligt eruit. | Bezit 2.000 apparaten tegelijk |
| **Goud** *(legendarisch)* — Verguld, met een glans die erover trekt. | Klik duizend gouden packets |
| **Kosmisch** *(mythisch)* — Geschreven in de sterren. | Bezit vijftig singulariteiten |
| **Hemels** *(goddelijk)* — Stralen van licht achter de naam. Je hoort bijna een koor. | Verzamel 3.000 studiepunten |
| **Pixelletters** *(ongewoon)* — Blokkerige letters, zoals op de doos van een oud spel. | Klik drieduizend keer |
| **Morse** *(zeldzaam)* — Zijn naam in streepjes en puntjes. Voor wie het kan lezen. | Rond twintig opdrachten af in de terminal |
| **Graffiti** *(episch)* — Gespoten op de muur achter de school. Er druipt nog verf van. | Typ hackerman, gewoon op je toetsenbord |

### Titel

| Titel | Hoe je hem vrijspeelt |
|---|---|
| **Geen titel** *(gewoon)* — Alleen de naam van het spel. | Heb je vanaf het begin |
| 📦 **Packetbezorger** *(gewoon)* — Eerste packet verstuurd. Het was spannend. | Verstuur je eerste packet |
| 🎒 **Stagiair** *(gewoon)* — Iedereen begint ergens. Meestal bij de printer. | Klik honderd keer |
| 🥤 **Koffiehaler** *(gewoon)* — Haalt koffie voor de echte netwerkbeheerders. | Koop je eerste upgrade |
| 🔌 **Kabeltrekker** *(gewoon)* — Trekt kabels door plafonds die daar niet voor gemaakt zijn. | Bezit 25 patchkabels |
| ☎️ **Helpdesk** *(gewoon)* — Heb je hem al uit- en weer aangezet? | Beantwoord een vraag van de overhoring goed |
| 💰 **Packet-miljonair** *(gewoon)* — Een miljoen, en het begint pas. | Verdien in totaal een miljoen packets |
| 🏰 **VLAN-vazal** *(ongewoon)* — Houdt de printer netjes in een eigen VLAN. | Bezit 50 switches tegelijk |
| 🏓 **Pingkampioen** *(ongewoon)* — Reply from 8.8.8.8: time=1ms. Elke keer. | Typ ping in de terminal |
| 📰 **Persmuskiet** *(ongewoon)* — Leest elk bericht. Twee keer. Hardop. | Klik 25 keer op de logbalk onder Serge |
| ⏳ **Tijdreiziger** *(ongewoon)* — Was weg, en kwam rijker terug. | Kom terug na een uur weg te zijn geweest |
| 💍 **Ridder van de Token Ring** *(ongewoon)* — Wacht netjes op zijn beurt. Altijd. | Ontdek Token Ring in de patchkast |
| 🖧 **Netwerkbeheerder** *(ongewoon)* — Het netwerk is van jou. De klachten ook. | Bezit honderd apparaten tegelijk |
| 🦉 **Nachtuil** *(zeldzaam)* — Het netwerk slaapt nooit. Jij ook niet. | Speel tussen drie en vier uur 's nachts |
| 📜 **CCNA** *(zeldzaam)* — Het eerste echte certificaat. Ingelijst boven het bureau. | Rond tien opdrachten in de terminal af |
| 🔓 **root** *(zeldzaam)* — Uid 0. Alles mag. Niets is veilig. | Typ een commando met sudo in de terminal |
| 🕶️ **Hackerman** *(zeldzaam)* — Hackt de tijd zelf. Of toch de wifi van de buren. | Typ het juiste woord (Serge noemt het kabelsalade) |
| 🚒 **Brandweer** *(zeldzaam)* — Blust incidenten voor iemand anders het merkt. | Los een incident op voor het uit de hand loopt |
| ⚡ **Bliksemschicht** *(zeldzaam)* — Sneller dan een gouden packet kan knipperen. | Klik een gouden packet binnen één seconde |
| 📈 **Beursgoeroe** *(zeldzaam)* — Koopt laag, verkoopt hoog, praat veel. | Verkoop tien keer met winst op de markt |
| ⛏️ **Goudzoeker** *(zeldzaam)* — Ziet een gouden packet voor het verschijnt. | Klik tweehonderd gouden packets |
| 🍎 **Serge's oogappel** *(zeldzaam)* — Heeft de hele cursus gelezen. Echt waar. | Lees de hele cursus |
| 🧾 **Werkordermachine** *(zeldzaam)* — Nog één goot, en dan naar huis. Zegt hij al drie uur. | Lever 25 werkorders op in de patchkast |
| 🧱 **Firewall-fluisteraar** *(zeldzaam)* — Praat zachtjes tegen poorten tot ze dichtgaan. | Koop een Next-gen Firewall |
| 👔 **Stylist** *(zeldzaam)* — Heeft een eigen look bewaard. Serge vraagt om advies. | Bewaar een eigen look bij Uiterlijk |
| 👑 **Subnetkoning** *(episch)* — Rekent een /27 uit in zijn slaap. En praat erover. | Vijfentwintig goede antwoorden op rij bij de overhoring |
| 🧲 **DDoS-magneet** *(episch)* — Rode packets vinden jou. Jij vindt ze nooit. | Negeer vijftig rode packets |
| 🎖️ **Kabelmeester** *(episch)* — Geen kabelsalade. Nooit. Nergens. | Lever een goot van 8 bij 8 luchtdicht op, zonder hulp |
| 🧬 **Protocoldokter** *(episch)* — Kent elk protocol, ook die je liever vergeet. | Ontdek alle protocollen in de patchkast |
| 🦈 **Marktmanipulator** *(episch)* — De koersen bewegen omdat jij het wilt. | Verdien een fortuin op de markt in één sessie |
| 💻 **Hacker** *(episch)* — Weet waar de achterdeur zit, en heeft een sleutel. | Vind de verborgen console |
| 💀 **Chaos-agent** *(episch)* — Typte rm -rf /. En het was geen ongeluk. | Voer rm -rf / uit in de terminal |
| 🖱️ **Klikmachine** *(episch)* — De muis is inmiddels aan vervanging toe. | Klik honderdduizend keer |
| 🫳 **Gouden handjes** *(episch)* — Alles wat hij aanraakt, wordt een gouden packet. | Klik duizend gouden packets |
| 🗺️ **BGP-baron** *(episch)* — Beslist welke kant het internet op gaat. | Bezit 250 core routers tegelijk |
| 🧘 **Uptime-monnik** *(episch)* — Vierentwintig uur zonder herstart. Innerlijke rust. | Speel in totaal 24 uur |
| ⚓ **Zeekabelkapitein** *(episch)* — Legt kabels over de bodem van de oceaan. Zeeziek wordt hij niet. | Bezit 50 zeekabels tegelijk |
| 🧺 **Verzamelaar** *(episch)* — Tweehonderd dingen vrijgespeeld. De kast zit vol. | Speel tweehonderd dingen vrij bij Uiterlijk |
| 🌀 **Singulariteit** *(legendarisch)* — Is het netwerk geworden. | Koop een singulariteit |
| 🌌 **Parallelle Serge** *(legendarisch)* — Bestaat in meerdere universums tegelijk. Alle versies klikken. | Koop een Parallel VPN |
| ☀️ **Dysonbouwer** *(legendarisch)* — Heeft een ster ingepakt om servers te koelen. | Koop een Dyson-datacenter |
| 🏅 **CCIE** *(legendarisch)* — Het zwaarste certificaat dat er is. Acht uur labo. | Verzamel honderd studiepunten |
| 🧑‍🏫 **Professor** *(legendarisch)* — Geeft zelf les. Serge komt kijken, en knikt. | Studeer tien keer af |
| 🔥 **Reekskoning** *(legendarisch)* — Vijfhonderd kliks op rij, zonder te stoppen. | Klik een reeks van vijfhonderd |
| 🚑 **De Klikgod** *(mythisch)* — Een miljoen kliks. Serge maakt zich zorgen. | Klik een miljoen keer |
| 🎓 **Eredoctor** *(mythisch)* — Zo vaak afgestudeerd dat de universiteit hem een gebouw gaf. | Studeer 25 keer af |
| 🐲 **Eindbaas** *(mythisch)* — Heeft de hele studieboom uitgespeeld. | Koop elk knooppunt in de studieboom |
| ☕ **Koffieverslaafde** *(mythisch)* — Het bloed is inmiddels bruin. Het koffiepeil staat op vol. | Bereik het hoogste koffiepeil |
| ♾️ **Onsterfelijk** *(mythisch)* — Honderd uur. Het spel speelt jou nu. | Speel in totaal honderd uur |
| 🏆 **Legende** *(mythisch)* — Er is niets meer te vinden. Echt niet. | Vind alles wat verborgen is |
| 💥 **De Oerknal** *(goddelijk)* — Honderd singulariteiten. Er ontstaat een nieuw universum. | Bezit honderd singulariteiten tegelijk |
| 🏛️ **De Architect** *(goddelijk)* — Heeft de hele studieboom gekocht en alles gevonden. Het netwerk is af. | Koop de hele studieboom en vind alles wat verborgen is |
| 🧔 **Serge** *(goddelijk)* — Je bent Serge geworden. Hij weet nog niet of hij dat fijn vindt. | Haal elke prestatie |

### Lettertype

| Lettertype | Hoe je hem vrijspeelt |
|---|---|
| **IBM Plex** *(gewoon)* — Strak en leesbaar, de letter van het spel. | Heb je vanaf het begin |
| **Rond** *(ongewoon)* — Zachte, ronde letters. | Koop 25 upgrades |
| **Krant** *(zeldzaam)* — Een schreefletter, zoals het ochtendnieuws. | Klik 25 keer op de logbalk onder Serge |
| **Typemachine** *(zeldzaam)* — Tik, tik, tik, ping. | Speel in totaal twee uur |
| **Terminal** *(zeldzaam)* — Alles in monospace. Echte beheerders lezen niets anders. | Rond tien opdrachten in de terminal af |
| **Handschrift** *(episch)* — Alsof Serge alles zelf heeft opgeschreven. | Lees de hele cursus |
| **Meme** *(episch)* — Bovenste tekst. Onderste tekst. | Vind tien verborgen dingen |
| **Comic Sans** *(legendarisch)* — De letter waar elke ontwerper van huilt. Serge vindt hem prachtig. | Speel op 1 april, of vind vijftien verborgen dingen |
| **Visitekaartje** *(zeldzaam)* — Deftige kapitalen, zoals op het kaartje van een directeur. | Haal 40 prestaties |
| **Mode** *(episch)* — Hoog contrast en dunne schreven, zoals op de cover van een modeblad. | Speel 150 dingen vrij bij Uiterlijk |
| **Middeleeuws** *(mythisch)* — Letters van een monnik met een ganzenveer. Het netwerk is een heilige kroniek. | Koop vijftig knooppunten in de studieboom |
| **Kalligrafie** *(goddelijk)* — Zwierige letters met krullen, geschreven op het diploma van een doctor. | Behaal het doctoraat in de studieboom |

### Zweeftekst

| Zweeftekst | Hoe je hem vrijspeelt |
|---|---|
| **Blauw pilletje** *(gewoon)* — Het getal in een blauw pilletje, zoals altijd. | Heb je vanaf het begin |
| **Kaal getal** *(gewoon)* — Geen pilletje, alleen het getal met een schaduw. | Klik duizend keer |
| **Terminal** *(ongewoon)* — Groen op zwart, met een prompt ervoor. | Rond je eerste opdracht in de terminal af |
| **Neon** *(ongewoon)* — Roze gloeiende cijfers die even nazoemen. | Haal 30 prestaties |
| **Stripboek** *(zeldzaam)* — Pats! Boem! Elke klik is een klap uit een stripverhaal. | Klik 25.000 keer |
| **8-bit** *(zeldzaam)* — Blokkige cijfers die in schokjes omhoog springen. | Typ de Konami-code |
| **Zeepbel** *(zeldzaam)* — Het getal in een bel die wiebelend opstijgt en knapt. | Verdien in totaal tien miljard packets |
| **Goudstuk** *(episch)* — Glanzend goud. Elke klik is een schat. | Klik 250 gouden packets |
| **Heet** *(episch)* — De cijfers staan in brand en schieten omhoog. | Bereik een miljard packets per seconde |
| **Glitch** *(episch)* — Het getal valt uit elkaar in rood en blauw. | Typ cisco in de terminal |
| **Regenboog** *(legendarisch)* — Alle kleuren, en het getal maakt een boogje opzij. | Studeer zeven keer af |
| **Sterrenstof** *(mythisch)* — Een getal van sterren dat langzaam uit elkaar dwarrelt. | Bezit 25 singulariteiten |
| **Hemels** *(goddelijk)* — Een getal van licht, met een straal die naar boven wijst. | Klik een miljoen keer |
| **Stempel** *(ongewoon)* — Een rode stempel, schuin op het papier. Goedgekeurd. | Lever vijf werkorders op |
| **Rode pen** *(zeldzaam)* — Met de rode pen van Serge, alsof hij je toets verbetert. | Beantwoord dertig vragen goed bij de overhoring |
| **Diamant** *(legendarisch)* — Geslepen cijfers die schitteren als ze opstijgen. | Klik 1.200 gouden packets |

### Meldingen

| Meldingen | Hoe je hem vrijspeelt |
|---|---|
| **Kaartje** *(gewoon)* — Een wit kaartje met een gekleurde rand. | Heb je vanaf het begin |
| **Donker** *(gewoon)* — Donkerblauw, met een streep in de kleur van het nieuws. | Speel in totaal een uur |
| **Post-it** *(ongewoon)* — Een geel briefje, met de hand geschreven en schuin opgeplakt. | Beantwoord een vraag goed bij de overhoring |
| **Syslog** *(ongewoon)* — Elke melding is een regel uit het logboek van de switch. | Rond je eerste opdracht in de terminal af |
| **Sms'je** *(zeldzaam)* — Een berichtje van Serge. Hij typt met één vinger. | Kom terug na een uur weg te zijn geweest |
| **Extra editie** *(zeldzaam)* — Elke melding haalt de voorpagina. | Klik 25 keer op de logbalk onder Serge |
| **Dialoogvenster** *(zeldzaam)* — Grijs, met een blauwe titelbalk en een kruisje dat niets doet. | Rechtsklik tien keer op Serge |
| **Trofee** *(episch)* — Elke melding voelt als een prestatie op een spelcomputer. | Haal 75 prestaties |
| **Neonbord** *(episch)* — Het flikkert even aan, en dan gloeit het. | Speel in totaal 24 uur |
| **Perkament** *(legendarisch)* — Een oorkonde met een lakzegel. Serge laat het voorlezen door een heraut. | Studeer vijftien keer af |
| **Hologram** *(mythisch)* — Doorschijnend en blauw, en het hapert af en toe. | Bezit 100 Quantum Links |
| **Hemelse boodschap** *(goddelijk)* — Elke melding daalt neer uit de hemel, met licht en al. | Behaal het doctoraat in de studieboom |
| **Brief** *(ongewoon)* — Een briefje op gelinieerd papier, met een postzegel in de hoek. | Koop twintig upgrades |
| **Arcade** *(zeldzaam)* — Blokletters op zwart, met een rand van pixels. 1UP! | Klik vijftig keer op het grote getal bovenaan |
| **Matglas** *(episch)* — Doorschijnend glas waar de pagina wazig doorheen schijnt. | Bezit vijftig vSphere-clusters |

### Nieuwsbalk

| Nieuwsbalk | Hoe je hem vrijspeelt |
|---|---|
| **Donkerblauw** *(gewoon)* — Het nieuws in een donkerblauwe balk. | Heb je vanaf het begin |
| **Laatste nieuws** *(gewoon)* — Een rood label en een witte balk, zoals op tv. | Verdien in totaal een miljoen packets |
| **Ondertitels** *(gewoon)* — Wit met een zwarte rand, zoals onder een film. | Speel in totaal een halfuur |
| **Terminal** *(ongewoon)* — Het nieuws als een logbestand dat je volgt met tail -f. | Voer je eerste commando uit in de terminal |
| **Lichtkrant** *(ongewoon)* — Oranje ledjes, en de tekst schuift van rechts naar links. | Klik 25 keer op de logbalk onder Serge |
| **Teletekst** *(zeldzaam)* — Pagina 101. Blokletters in felle kleuren, zoals vroeger. | Klik drie keer op het versienummer |
| **Chat** *(zeldzaam)* — Serge stuurt je het nieuws zelf, in een berichtje. | Kom terug na een uur weg te zijn geweest |
| **Radio** *(zeldzaam)* — Serge FM, met een equalizer die meedanst. | Speel in totaal acht uur |
| **Ochtendkrant** *(episch)* — Elk bericht is de kop van de voorpagina. | Haal negentig prestaties |
| **Telex** *(episch)* — Een papieren strook waarop de letters een voor een verschijnen. | Rond vijftig opdrachten af in de terminal |
| **Hologram** *(legendarisch)* — Doorschijnend blauw, en het hapert soms. | Bezit vijftig AI NetOps |
| **Openingstekst** *(mythisch)* — Lang geleden, in een netwerk hier ver vandaan. Het nieuws kruipt schuin de ruimte in. | Studeer 25 keer af |
| **Hemels bericht** *(goddelijk)* — Het nieuws in gouden letters, met licht van boven. | Vind alles wat verborgen is |
| **Oude gsm** *(ongewoon)* — Donkere pixels op een groen schermpje. Onverwoestbaar. | Klik 3.310 keer |
| **Stripballon** *(zeldzaam)* — Het nieuws als tekstballon uit een stripverhaal. | Haal 45 prestaties |
| **Graffitimuur** *(episch)* — Gespoten op een bakstenen muur, met verf die nog nat is. | Typ hackerman, gewoon op je toetsenbord |

### Klikeffect

| Klikeffect | Hoe je hem vrijspeelt |
|---|---|
| **Vonken** *(gewoon)* — Blauwe vonken, zoals altijd. | Heb je vanaf het begin |
| **Bits** *(gewoon)* — Nullen en enen die uit elkaar vliegen. | Klik duizend keer |
| **Pakketjes** *(ongewoon)* — Kleine packets met een gekleurde header, in een boog. | Lever tien werkorders op in de patchkast |
| **Bubbels** *(ongewoon)* — Zeepbellen die wiebelend omhoog drijven. | Verdien in totaal tien miljoen packets |
| **Ping** *(zeldzaam)* — Een echo die zich uitbreidt, zoals een sonar. | Rond tien opdrachten in de terminal af |
| **Hartjes** *(zeldzaam)* — Serge vindt het ook fijn. | Klik tien keer precies op zijn neus |
| **Lerarenkamer** *(zeldzaam)* — Koffie, pizza, pinguïns en diskettes. | Haal 50 prestaties |
| **Glitch** *(zeldzaam)* — Kapotte pixels die even door het beeld flitsen. | Typ cisco in de terminal |
| **Pixels** *(zeldzaam)* — Vierkante blokjes die schokkerig wegspringen, zoals in 1985. | Typ de Konami-code |
| **Regenboogschok** *(zeldzaam)* — Een ring in alle kleuren die van je klik wegrolt. | Studeer één keer af |
| **Confetti** *(episch)* — Een feestje bij elke klik. | Studeer drie keer af |
| **Vuurwerk** *(episch)* — Een gouden pijl die openbarst. | Klik driehonderd gouden packets |
| **Laser** *(episch)* — Vier stralen die uit je klik schieten. | Klik honderdduizend keer |
| **Bliksem** *(episch)* — Zigzaggende bliksemschichten die van je klik wegschieten. | Klik een gouden packet binnen één seconde |
| **Zwart gat** *(legendarisch)* — Alles wordt naar binnen gezogen. | Bezit tien singulariteiten |
| **Supernova** *(mythisch)* — Een ster die ineenstort en openbarst in een schokgolf. | Bezit vijftig singulariteiten |
| **Oerknal** *(goddelijk)* — Alles begint bij jouw klik: een lichtflits, een ring en sterren in alle kleuren. | Haal elke prestatie |
| **Sneeuwvlokjes** *(ongewoon)* — Kleine vlokjes die van je klik weg dwarrelen. | Klik 7.500 keer |
| **Muziek** *(zeldzaam)* — Noten die van je klik opstijgen, elke keer een andere. | Klik veertigduizend keer |
| **Portaaltje** *(legendarisch)* — Een klein kolkend portaal dat opengaat en weer dichtklapt. | Bezit tien Parallel VPN's |

### Klikreeks

| Klikreeks | Hoe je hem vrijspeelt |
|---|---|
| **Geen reeks** *(gewoon)* — Je klikt in stilte. | Heb je vanaf het begin |
| **Arcade** *(gewoon)* — COMBO ×12, in dikke gele letters. | Klik duizend keer |
| **Vechtspel** *(ongewoon)* — 12 HITS! En bij elke mijlpaal een kreet. | Klik tienduizend keer |
| **Ritmespel** *(zeldzaam)* — Klik je gelijkmatig, dan is het PERFECT. Anders GOED. Of net niet. | Tien goede antwoorden op rij bij de overhoring |
| **Sportcommentaar** *(zeldzaam)* — Een commentator die bij elke mijlpaal zijn stem verliest. | Klik een reeks van vijftig |
| **Serge keurt** *(episch)* — Serge zegt wat hij ervan vindt. Streng, maar rechtvaardig. | Beantwoord honderd vragen goed bij de overhoring |
| **Krachtniveau** *(legendarisch)* — Je krachtniveau stijgt met elke klik. Tot het meer dan negenduizend is. | Klik een reeks van driehonderd |
| **Hemelse reeks** *(goddelijk)* — Romeinse cijfers in goud, en bij elke mijlpaal zingt er een koor. | Klik een miljoen keer |
| **Gezichtjes** *(ongewoon)* — Een gezichtje dat steeds enthousiaster wordt naarmate je reeks groeit. | Klik een reeks van 25 |
| **DJ Serge** *(zeldzaam)* — De dj roept je reeks om, met scratches erbij. | Klik een reeks van 150 |
| **Toverspreuken** *(mythisch)* — Elke mijlpaal een spreuk. Klikus Maximus! | Klik een reeks van zeshonderd |

### Cursor

| Cursor | Hoe je hem vrijspeelt |
|---|---|
| **Systeem** *(gewoon)* — De muisaanwijzer van je computer. | Heb je vanaf het begin |
| **Dikke pijl** *(gewoon)* — Een grote blauwe pijl. Je raakt hem nooit meer kwijt. | Klik honderd keer |
| **RJ45-stekker** *(ongewoon)* — Je klikt met de stekker van een netwerkkabel. Het klikje hoor je erbij. | Lever je eerste werkorder op in de patchkast |
| **Pixelhand** *(ongewoon)* — Een wijzend handje uit de tijd van de diskette. | Typ de Konami-code |
| **Laserpointer** *(zeldzaam)* — Een rood stipje, zoals Serge gebruikt bij zijn dia's. Niet naar de kat richten. | Klik een gouden packet binnen één seconde |
| **Zwaard** *(zeldzaam)* — Voor de strijd tegen DDoS-aanvallen. | Overleef je eerste DDoS-packet |
| **Vizier** *(zeldzaam)* — Mikken, ademhalen, klikken. | Klik tweehonderd gouden packets |
| **Kattenpoot** *(episch)* — De serverkat helpt mee. Ze klikt waar ze wil. | Heb precies 42 exemplaren van één apparaat |
| **Toverstaf** *(episch)* — Een tik met de staf, en er komen packets uit. | Studeer vier keer af |
| **Gouden pijl** *(legendarisch)* — Massief goud. Zwaar om mee te klikken, maar het staat je goed. | Klik 1.500 gouden packets |
| **Komeet** *(mythisch)* — Een ster met een staart van licht. | Bezit 50 Dyson-datacenters |
| **Hemelse vinger** *(goddelijk)* — De vinger uit het plafond van de Sixtijnse Kapel. Eén aanraking en er komt leven in het netwerk. | Haal elke prestatie |
| **Potlood** *(gewoon)* — Een geel potlood met een gumpje. Klaar voor de overhoring. | Beantwoord drie vragen goed bij de overhoring |
| **Pizzapunt** *(ongewoon)* — Een punt pizza. Het puntje klikt. | Speel in totaal vijf uur |
| **Bliksem** *(episch)* — Een bliksemschicht. Elke klik slaat in. | Bezit vijftig SDN-controllers |

### Muisspoor

| Muisspoor | Hoe je hem vrijspeelt |
|---|---|
| **Geen spoor** *(gewoon)* — Gewoon een muis. | Heb je vanaf het begin |
| **Kabel** *(ongewoon)* — Een blauwe patchkabel die achter je muis aan sleept. | Lever je eerste werkorder op in de patchkast |
| **Sterrenstof** *(ongewoon)* — Glinsters die langzaam uitdoven. | Klik tien gouden packets |
| **Bits** *(zeldzaam)* — Een staart van nullen en enen. | Klik vijftig keer op het grote getal bovenaan |
| **Hartjes** *(zeldzaam)* — Kleine hartjes die opstijgen waar je muis was. | Klik tien keer precies op zijn neus |
| **Neonbuis** *(zeldzaam)* — Een gloeiende cyaan lijn, als een neonreclame. | Haal 40 prestaties |
| **Bubbels** *(zeldzaam)* — Belletjes die achter je muis omhoog drijven. | Laat het spel tien minuten met rust |
| **Regenboog** *(episch)* — Een lint in alle kleuren. | Studeer één keer af |
| **Vuurspoor** *(episch)* — Vlammetjes die opflakkeren en uitdoven. | Speel in totaal 36 uur |
| **Komeet** *(goddelijk)* — Een felle kern met een lange staart van sterren in alle kleuren. | Speel in totaal 150 uur |
| **Pixels** *(ongewoon)* — Blokjes in felle kleuren die achter je muis vallen. | Typ de Konami-code |
| **Muzieknoten** *(zeldzaam)* — Een melodie die achter je muis opstijgt. | Klik een reeks van veertig |
| **Bliksemspoor** *(legendarisch)* — Een zigzag van elektriciteit die achter je muis knettert. | Bezit honderd next-gen firewalls |
| **Spookmuizen** *(mythisch)* — Doorschijnende muisaanwijzers die je muis blijven volgen, alsof er iemand meekijkt. | Speel in totaal 175 uur |

### Klikgeluid

| Klikgeluid | Hoe je hem vrijspeelt |
|---|---|
| **Blip** *(gewoon)* — Het korte piepje van altijd. | Heb je vanaf het begin |
| **Deurbel** *(gewoon)* — Ding-dong. Wie is daar? Een packet. | Klik vijfhonderd keer |
| **Mechanisch** *(ongewoon)* — Het klikje van een mechanisch toetsenbord. | Klik tienduizend keer |
| **Kassa** *(ongewoon)* — Ka-tsjing. | Maak winst op de bandbreedtemarkt |
| **Robot** *(ongewoon)* — Bliep-bloep, in willekeurige volgorde. | Rond je eerste opdracht in de terminal af |
| **Muntje** *(ongewoon)* — Het geluid van een munt in een arcadekast. | Verdien in totaal honderd miljoen packets |
| **8-bit** *(zeldzaam)* — Twee snelle tonen, zoals een oude spelcomputer. | Typ de Konami-code |
| **Inbelmodem** *(zeldzaam)* — Een piepend fluitje uit 1998. | Vind vijf verborgen dingen |
| **Harp** *(zeldzaam)* — Elke klik een toon uit dezelfde toonladder. Klinkt altijd mooi. | Verzamel vijf studiepunten |
| **Melodie** *(zeldzaam)* — Elke klik is de volgende noot van een bekend liedje. | Klik drie keer op het versienummer |
| **Pew** *(zeldzaam)* — Een laserpistool uit een oude sciencefictionfilm. | Klik tweehonderd gouden packets |
| **Druppel** *(zeldzaam)* — Een zachte druppel in een stil serverlokaal. | Haal 60 prestaties |
| **Xylofoon** *(zeldzaam)* — Houten klankstaven, telkens een andere. | Haal 30 prestaties |
| **Miauw** *(episch)* — De serverkat is het eens met je klik. | Heb precies 42 exemplaren van één apparaat |
| **Subwoofer** *(episch)* — Een diepe dreun. Het rack trilt mee. | Bezit 100 datacenters tegelijk |
| **Hemelkoor** *(goddelijk)* — Een zacht koor dat bij elke klik aanzwelt. | Verzamel 2.000 studiepunten |
| **Beatbox** *(zeldzaam)* — Boem, tss, boem-boem, tss. Om de beurt. | Klik een reeks van 75 |
| **Energiezwaard** *(legendarisch)* — Een zoemend zwaard van licht dat door de lucht zwiept. | Zie tweehonderd rode packets |
| **Theremin** *(mythisch)* — Een zweverige toon uit een oude sciencefictionfilm. | Bezit 150 Quantum Links |

### Muziek

| Muziek | Hoe je hem vrijspeelt |
|---|---|
| **Stilte** *(gewoon)* — Alleen het zoemen van de servers. Of zelfs dat niet. | Heb je vanaf het begin |
| **Serverruimte** *(gewoon)* — Ventilatoren, het brommen van de stroom, en af en toe een harde schijf die iets zoekt. | Koop een serverrack |
| **Lo-fi om te studeren** *(ongewoon)* — Rustige akkoorden en een loom ritme. Voor lange avonden met de cursus. | Lees een hoofdstuk van de cursus |
| **Liftmuziek** *(zeldzaam)* — Uw klik is belangrijk voor ons. Een ogenblik geduld alstublieft. | Laat het spel tien minuten met rust |
| **8-bit** *(zeldzaam)* — Een deuntje uit een oude spelcomputer, met blokgolven en al. | Typ de Konami-code |
| **Synthwave** *(episch)* — Neonlicht, een zonsondergang en een bas die maar doorgaat. | Speel in totaal twaalf uur |
| **Rave in het datacenter** *(episch)* — Vier op de vloer. De racks knipperen mee. | Bezit 100 datacenters tegelijk |
| **Eindbaas** *(legendarisch)* — Het laatste level. Snel, donker en vol spanning. | Lever een goot van 8 bij 8 luchtdicht op, zonder hulp |
| **Ruimtereis** *(mythisch)* — Trage klanken met een echo, ergens tussen twee sterren. | Bezit 25 Parallel VPN's |
| **Hemelse harmonie** *(goddelijk)* — Een koor en klokjes. Zo klinkt het als het netwerk af is. | Verzamel 3.000 studiepunten |
| **Jazzcafé** *(zeldzaam)* — Een wandelende bas, een zacht bekken en een piano die meedenkt. | Speel in totaal negen uur |
| **Eurodance** *(episch)* — Pianostoten en een bas die op de tweede tel springt. Het is 1995. | Studeer negen keer af |

De geëvolueerde Serge is de opvolger van de oude Evolve-knop: bij een miljard packets verdiend krijg je een melding en kun je hem omzetten.

## Alle prestaties

128 stuks. De verborgen staan in het volgende hoofdstuk.

### Klikken

| Prestatie | Hoe |
|---|---|
| 🖱️ **Eerste packet** | Verstuur je eerste packet. |
| 💨 **Packet pusher** | Klik honderd keer. |
| 💥 **Klikspecialist** | Klik duizend keer. |
| 🦾 **Peesontsteking** | Klik tienduizend keer. |
| 🪦 **Muis versleten** | Klik honderdduizend keer. |
| 🚑 **Serge maakt zich zorgen** | Klik een miljoen keer. |

### Verdiend

| Prestatie | Hoe |
|---|---|
| 🎉 **Eerste duizend** | Verdien in totaal duizend packets. |
| 💰 **Packet-miljonair** | Verdien in totaal een miljoen packets. |
| 🏦 **Packet-miljardair** | Verdien in totaal een miljard packets. |
| 🧾 **Biljoen** | Verdien in totaal een biljoen packets. |
| 📈 **Biljard** | Verdien in totaal een biljard packets. |
| 🛸 **Triljoen** | Verdien in totaal een triljoen packets. |
| 🌌 **Triljard** | Verdien in totaal een triljard packets. |
| 🕳️ **Quadriljoen** | Verdien in totaal een quadriljoen packets. |
| ♾️ **Voorbij het telbare** | Verdien in totaal een quadriljard packets. |

### Productie

| Prestatie | Hoe |
|---|---|
| 🚶 **Het loopt** | Bereik 10 packets per seconde. |
| 🏃 **Lijnsnelheid** | Bereik 1000 packets per seconde. |
| 🚄 **Backbone** | Bereik een miljoen packets per seconde. |
| 💫 **Lichtsnelheid** | Bereik een miljard packets per seconde. |
| 📡 **Buiten de spec** | Bereik een biljoen packets per seconde. |
| 🔭 **Onmeetbaar** | Bereik een biljard packets per seconde. |

### Apparaten

| Prestatie | Hoe |
|---|---|
| 🔌 **Patchkabel** | Koop je eerste patchkabel. |
| 🔌 **Patchkabel x50** | Bezit vijftig keer patchkabel. |
| 🔀 **Netwerk Switch** | Koop je eerste netwerk switch. |
| 🔀 **Netwerk Switch x50** | Bezit vijftig keer netwerk switch. |
| 🧭 **Core Router** | Koop je eerste core router. |
| 🧭 **Core Router x50** | Bezit vijftig keer core router. |
| 🧵 **Glasvezel** | Koop je eerste glasvezel. |
| 🧵 **Glasvezel x50** | Bezit vijftig keer glasvezel. |
| 🗄️ **Serverrack** | Koop je eerste serverrack. |
| 🗄️ **Serverrack x50** | Bezit vijftig keer serverrack. |
| 🏢 **Datacenter** | Koop je eerste datacenter. |
| 🏢 **Datacenter x50** | Bezit vijftig keer datacenter. |
| 🖥️ **Proxmox Cluster** | Koop je eerste proxmox cluster. |
| 🖥️ **Proxmox Cluster x50** | Bezit vijftig keer proxmox cluster. |
| 🧊 **vSphere Cluster** | Koop je eerste vsphere cluster. |
| 🧊 **vSphere Cluster x50** | Bezit vijftig keer vsphere cluster. |
| 🗂️ **Active Directory** | Koop je eerste active directory. |
| 🗂️ **Active Directory x50** | Bezit vijftig keer active directory. |
| ☸️ **Kubernetes Cluster** | Koop je eerste kubernetes cluster. |
| ☸️ **Kubernetes Cluster x50** | Bezit vijftig keer kubernetes cluster. |
| 🎛️ **SDN Controller** | Koop je eerste sdn controller. |
| 🎛️ **SDN Controller x50** | Bezit vijftig keer sdn controller. |
| 🧱 **Next-gen Firewall** | Koop je eerste next-gen firewall. |
| 🧱 **Next-gen Firewall x50** | Bezit vijftig keer next-gen firewall. |
| 🛡️ **Security Operations** | Koop je eerste security operations. |
| 🛡️ **Security Operations x50** | Bezit vijftig keer security operations. |
| ☁️ **Hyperscaler-regio** | Koop je eerste hyperscaler-regio. |
| ☁️ **Hyperscaler-regio x50** | Bezit vijftig keer hyperscaler-regio. |
| 🌑 **Dark Fiber Mesh** | Koop je eerste dark fiber mesh. |
| 🌑 **Dark Fiber Mesh x50** | Bezit vijftig keer dark fiber mesh. |
| 🌊 **Zeekabel** | Koop je eerste zeekabel. |
| 🌊 **Zeekabel x50** | Bezit vijftig keer zeekabel. |
| 🛰️ **Satellietconstellatie** | Koop je eerste satellietconstellatie. |
| 🛰️ **Satellietconstellatie x50** | Bezit vijftig keer satellietconstellatie. |
| ⚛️ **Quantum Link** | Koop je eerste quantum link. |
| ⚛️ **Quantum Link x50** | Bezit vijftig keer quantum link. |
| 🧠 **AI NetOps** | Koop je eerste ai netops. |
| 🧠 **AI NetOps x50** | Bezit vijftig keer ai netops. |
| 🌞 **Dyson-datacenter** | Koop je eerste dyson-datacenter. |
| 🌞 **Dyson-datacenter x50** | Bezit vijftig keer dyson-datacenter. |
| 🌌 **Parallel VPN** | Koop je eerste parallel vpn. |
| 🌌 **Parallel VPN x50** | Bezit vijftig keer parallel vpn. |
| 🕳️ **Singulariteit** | Koop je eerste singulariteit. |
| 🕳️ **Singulariteit x50** | Bezit vijftig keer singulariteit. |
| 🧰 **Volledige uitrusting** | Bezit minstens één van elk gebouw. |
| 💯 **Honderd van hetzelfde** | Bezit honderd exemplaren van één gebouw. |
| 🏗️ **Vijfhonderd apparaten** | Bezit vijfhonderd gebouwen in totaal. |
| 🌐 **Eigen infrastructuur** | Bezit tweeduizend gebouwen in totaal. |

### Upgrades

| Prestatie | Hoe |
|---|---|
| ⬆️ **Eerste verbetering** | Koop je eerste upgrade. |
| 🧩 **Doorgevoerde wijzigingen** | Koop 25 upgrades. |
| 📋 **Changelog** | Koop 75 upgrades. |
| 🩺 **Alles gepatcht** | Koop 150 upgrades. |

### Gouden packets

| Prestatie | Hoe |
|---|---|
| ✨ **Gouden vangst** | Klik je eerste gouden packet. |
| 🍀 **Geluksvogel** | Klik tien gouden packets. |
| 🎰 **Vaste klant** | Klik vijftig gouden packets. |
| 🔍 **Statistisch verdacht** | Klik tweehonderd gouden packets. |
| 🚨 **Onder vuur** | Overleef je eerste DDoS-packet. |
| ⚡ **Reactietijd** | Klik een gouden packet binnen één seconde. |

### Studie

| Prestatie | Hoe |
|---|---|
| 🎓 **Eerste diploma** | Studeer één keer af. |
| 📚 **Vijf jaar erbij** | Verzamel vijf studiepunten. |
| 🧠 **Levenslang leren** | Verzamel 25 studiepunten. |
| 🏅 **Eredoctoraat** | Verzamel honderd studiepunten. |
| 🌳 **Volledig curriculum** | Koop elk knooppunt in de studieboom. |

### Labo

| Prestatie | Hoe |
|---|---|
| 📖 **Eerste hoofdstuk** | Lees een hoofdstuk van de cursus. |
| 🎒 **Cursus uit** | Lees alle hoofdstukken van de cursus. |
| 📝 **Eerste overhoring** | Beantwoord een vraag van de overhoring goed. |
| ✅ **Serge knikt** | Tien goede antwoorden op rij. |
| 🧮 **Subnetten in je hoofd** | Vijfentwintig goede antwoorden op rij. |
| ⌨️ **enable** | Voer je eerste commando uit in de terminal. |
| 💾 **Running config** | Rond je eerste opdracht in de terminal af. |
| 🧑‍💻 **Vaste hand op de CLI** | Rond tien opdrachten in de terminal af. |
| 📈 **Koop laag, verkoop hoog** | Maak winst op de bandbreedtemarkt. |
| 🤑 **Marktmanipulatie** | Verdien een fortuin op de markt in één sessie. |
| 🔔 **Beursvloer** | Verkoop tien keer met winst op de markt. |
| 🤖 **Automatische piloot** | Laat een winstorder of verliesgrens voor je verkopen. |
| 🗞️ **Voorkennis** | Koop op een gerucht dat uitkomt, en verkoop met winst. |
| 🗒️ **Eerste werkorder** | Lever je eerste werkorder in de patchkast op. |
| 🌬️ **Luchtdicht** | Lever een werkorder op waarbij de hele kabelgoot vol ligt. |
| 🎖️ **Kabelmeester** | Lever een goot van 8 bij 8 luchtdicht op, zonder hulp van Serge. |
| 🧬 **Nieuw protocol** | Ontdek een protocol in de patchkast. |
| 🗃️ **Volledige patchkast** | Ontdek elk protocol. |

### Overig

| Prestatie | Hoe |
|---|---|
| 🌙 **Terug van weggeweest** | Kom terug na een uur weg te zijn geweest. |
| 🔧 **Storing verholpen** | Los een incident op voor het uit de hand loopt. |
| ☕ **Koffie op** | Bereik het hoogste koffiepeil. |
| 📉 **Alles verkocht** | Verkoop honderd apparaten. |

## Verborgen: de easter eggs

Er zitten 20 verborgen dingen in het spel. Elk levert een eigen prestatie op en meestal een handvol packets. Ze staan nergens in het spel uitgelegd — hieronder wel.

| Prestatie | Hoe je hem vindt |
|---|---|
| 🕹️ Up, up, down, down | Typ de Konami-code: ↑ ↑ ↓ ↓ ← → ← → b a |
| 🧔 Naamsvermelding | Typ ergens in het spel het woord `serge` |
| 👃 Op de neus | Klik tien keer precies in het midden van de foto |
| 📰 Persmuskiet | Klik vijfentwintig keer op de zwarte logbalk onder Serge |
| 🔢 Telfout | Klik vijftig keer op het grote getal bovenaan |
| 😎 Elite | Zorg dat je precies 1337 packets in bezit hebt (wordt elke 20 seconden nagekeken, dus makkelijkst aan het begin) |
| 🐋 Het antwoord | Bezit precies 42 exemplaren van één apparaat |
| 🧘 Geduld | Laat het spel tien minuten openstaan zonder te klikken of te typen |
| 🖲️ Contextmenu | Rechtsklik tien keer op Serge |
| 📶 Reply from 8.8.8.8 | Typ `ping` in de terminal |
| 🔓 sudo | Typ een commando dat begint met `sudo` in de terminal |
| 🏷️ Vendor lock-in | Typ `cisco` in de terminal |
| 🔌 no shutdown | Typ `no shutdown` op een interface die al up staat |
| 💀 rm -rf / | Typ `rm -rf /` in de terminal |
| 🍝 Kabelsalade | Typ het woord `hackerman` |
| 🕐 13:37 | Wees om 13:37 in het spel |
| 🌃 Nachtdienst | Speel tussen drie en vier uur 's nachts |
| 💍 Token Ring | Ontdek Token Ring in de patchkast: dat gebeurt na 2 opgeleverde werkorders |
| 🔎 Kleine lettertjes | Klik drie keer op het versienummer onderaan het tandwiel-paneel |
| 🚪 Achterdeur | Klik zeven keer op datzelfde versienummer |

Haal je er tien, dan krijg je **🗺️ Zoeker**. Haal je ze allemaal, dan krijg je **🏆 Alles gevonden**. Die twee tellen niet mee als easter egg zelf.

## Verborgen: de console

Klik in het tandwiel-paneel rechtsboven zeven keer op het versienummer onder **Over**. Er verschijnt dan een invoerveld waarmee je het spel rechtstreeks kunt aansturen. Bedoeld om te testen; wie hem gebruikt krijgt geen straf, alleen een merkteken op de save.

| Commando | Wat het doet |
|---|---|
| `add 1e9` | Voegt packets toe (telt niet mee voor je totaal, dus ook niet voor studiepunten) |
| `set 1000` | Zet je aantal packets op een vast getal |
| `pps 500` | Zet ongeveer die productie per seconde neer door switches bij te maken |
| `gebouw switch 100` | Zet het aantal van één apparaat. De id's staan hieronder. |
| `upgrades` | Geeft alle upgrades vrij |
| `prestaties` | Geeft alle prestaties vrij |
| `skins` | Geeft alles van Uiterlijk vrij, van portretten en ringen tot muziek, opstartschermen en looks |
| `punten 50` | Voegt studiepunten toe |
| `goud` | Laat meteen een gouden packet verschijnen |
| `reset` | Wist alle actieve buffs en straffen |

De id's voor `gebouw`: `patchkabel`, `switch`, `router`, `fiber`, `rack`, `datacenter`, `proxmox`, `vsphere`, `ad`, `k8s`, `sdn`, `firewall`, `soc`, `hyperscaler`, `darkfiber`, `subsea`, `satellite`, `quantum`, `neural`, `dyson`, `multiverse`, `singularity`.

Onzichtbaar maar aanwezig: in de browserconsole bestaat `serge.pps`, `serge.packets` en `serge.hint`.

## Technisch

- Je voortgang staat in localStorage van je eigen browser en wordt elke twintig seconden bewaard, plus bij het sluiten van het tabblad.

- Er zijn drie opslagbestanden. Met **Kopieer code** krijg je een tekstcode waarmee je je voortgang op een ander toestel kunt inladen. Een import kun je daarna nog ongedaan maken.

- Open je het spel in twee tabbladen op hetzelfde bestand, dan slaat alleen het nieuwste tabblad nog op, zodat ze elkaars voortgang niet overschrijven.

- Ben je weg geweest, dan krijg je een deel van je gemiste productie terug: standaard 40% over maximaal twee uur, op te schroeven tot 100% over 24 uur via de tak Beheer in de studieboom.

- Staat het tabblad op de achtergrond, dan telt die tijd volledig mee tot een uur. Een buff telt daarbij alleen zolang hij duurde.

- Saves van de allereerste versie van het spel worden automatisch omgezet: packets, apparaten, kliks en gouden packets komen mee, en wie destijds Evolve had gehaald krijgt daar een studiepunt voor.

- Het spel gebruikt ES-modules, dus `index.html` los openen werkt niet. Via GitHub Pages of een lokale webserver wel (`npm start`).

