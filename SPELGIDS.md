# Serge Clicker — volledige spelgids

> **Let op: hier staat alles in, ook alle verborgen dingen.** Wil je zelf zoeken, lees dan niet verder dan het hoofdstuk over de studieboom.

Dit bestand is gemaakt met `node tools/spelgids.mjs` en volgt de spelbestanden. Op dit moment: **22 apparaten**, **154 upgrades**, **128 prestaties** (waarvan 20 verborgen), **24 knooppunten** in de studieboom en **5 onderdelen** in het labo.

## Hoe het spel werkt

Je klikt op Serge en verdient packets. Met packets koop je apparaten die vanzelf packets opleveren, en upgrades die alles versnellen. Hoe verder je komt, hoe meer het spel zichzelf speelt — en hoe meer er opengaat.

De volgorde waarin dingen vrijkomen:

1. **Winkel** — meteen. Klik tot je 15 packets hebt voor je eerste patchkabel.

2. **Upgrades** — zodra je er een verdient (tien kliks geeft de eerste al).

3. **Prestaties** — meteen zichtbaar, ze vullen zich vanzelf.

4. **Labo** — bij 5.000 packets totaal. Daarbinnen gaat elke opdracht apart open.

5. **Studie** — bij 1 miljard packets totaal. Vanaf 10 miljard kun je voor het eerst afstuderen.

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

Vanaf 10 miljard packets totaal kun je afstuderen. Je verliest je packets, apparaten en upgrades, maar je houdt je prestaties, je koffiepeil en de hele studieboom — en je krijgt studiepunten.

Het aantal punten is de derdemachtswortel van je totaal gedeeld door 10 miljard. In gewone taal: elk volgend punt kost meer dan het vorige, dus verder spelen loont, maar oneindig doorgaan niet.

Elk studiepunt geeft daarnaast blijvend 10% extra productie, ook de punten die je alweer uitgegeven hebt. Afstuderen loont het meest als je bonus uit studiepunten er minstens door verdubbelt.

### 🎓 Studie — Meer rendement uit elk diploma.

| Knooppunt | Kosten | Effect |
|---|---|---|
| 🖊️ **Inschrijving** | 1 punten | Alles produceert 5% meer. |
| 📄 **Vrijstelling** | 3 punten | Begin elke run met 10.000 packets. |
| 💶 **Studietoelage** | 10 punten | Begin elke run met 5 miljoen packets. |
| 📌 **Bindend advies** | 30 punten | Alles produceert 10% meer. |
| 🔬 **Onderzoeksbeurs** | 100 punten | Je krijgt 15% meer studiepunten bij het afstuderen. |
| 🏛️ **Emeritus** | 300 punten | Nog eens 25% meer studiepunten en 15% meer productie. |

### 🌙 Beheer — Je netwerk draait door terwijl jij weg bent.

| Knooppunt | Kosten | Effect |
|---|---|---|
| 🌜 **Nachtploeg** | 2 punten | Offline tijd telt tot 4 uur mee. |
| 📟 **Monitoring** | 8 punten | Offline productie stijgt naar 60%. |
| 🤖 **Automatisering** | 25 punten | Offline tijd telt tot 8 uur mee. |
| 📘 **Draaiboek** | 60 punten | Offline productie stijgt naar 80%. |
| 🔦 **Lights-out** | 200 punten | Offline tijd telt volledig mee, tot 24 uur. |
| 🩹 **Zelfherstel** | 500 punten | Incidenten lossen na 30 seconden vanzelf op. |

### 🍀 Geluk — Gouden packets, vaker en sterker.

| Knooppunt | Kosten | Effect |
|---|---|---|
| 🔮 **Voorgevoel** | 2 punten | Gouden packets verschijnen 15% vaker. |
| ⏱️ **Tweede kans** | 8 punten | Gouden packets blijven 25% langer staan. |
| 🌅 **Gouden uur** | 25 punten | Buffs werken 25% sterker. |
| 🤝 **Vaste hand** | 70 punten | Buffs duren 25% langer. |
| 🎲 **Meervoudig** | 220 punten | 15% meer kans op een dubbele buff. |
| 🌧️ **Gouden regen** | 600 punten | Elke run start met een gratis buff. |

### 🔧 Praktijk — Klikken en labo's.

| Knooppunt | Kosten | Effect |
|---|---|---|
| ✋ **Handigheid** | 2 punten | Klikkracht x2. |
| 💪 **Spiergeheugen** | 8 punten | Klikkracht x2. |
| 🧪 **Labo-ervaring** | 25 punten | Minigames leveren 50% meer op. |
| 📝 **Examentraining** | 70 punten | Minigames leveren nog eens 50% meer op. |
| 🥇 **Meesterschap** | 200 punten | Elke klik levert er 2% van je productie per seconde bij. |
| 🙌 **Serge's zegen** | 500 punten | Alles produceert 25% meer. |

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

Vraagt 5.000 packets totaal. Je krijgt een subnetvraag met vier antwoorden. Goed antwoord levert packets op — minstens 500, of 90 seconden van je productie, wat het meest is — plus 12% extra per goed antwoord op rij, tot drie keer zoveel. Na een goed antwoord duurt het 2,5 minuut voor de volgende vraag; na een fout antwoord ruim een minuut, en je reeks begint opnieuw.

De vragen worden ter plekke opgesteld en ter plekke nagerekend, dus ze zijn eindeloos. Zes soorten: netwerkadres, broadcastadres, aantal bruikbare hosts, subnetmasker bij een prefix, het kleinste subnet voor een aantal hosts, en of twee adressen in hetzelfde subnet zitten.

### ⌨️ Terminal

Vraagt één netwerk switch. Een nagebouwde command line die zich gedraagt als een switch die nog opgezet moet worden — inclusief de eigenaardigheden van een echte IOS-CLI.

**Afkortingen werken.** Elk woord mag je inkorten tot het nog eenduidig is, precies zoals op een echt apparaat: `en`, `conf t`, `int gi0/1`, `ip add`, `no shut`, `sh ip int br`, `wr`. Is een afkorting dubbelzinnig, dan zegt hij welke woorden er nog passen.

**Tab vult aan.** Eén woord dat past wordt afgemaakt; passen er meerdere, dan vult hij aan tot waar ze gelijk zijn en toont hij de mogelijkheden. **?** laat zien wat er op deze plek mag staan, met uitleg erbij — ook midden in een commando.

**Er staat altijd een opdracht open.** Serge vraagt je een poort op een bepaald adres te zetten, hem up te brengen en de configuratie te bewaren. Rond je dat af met `write memory`, dan krijg je packets: minstens 2.500, of twee minuten van je productie, wat het meest is. Daarna schrijft hij na tweeënhalve minuut een nieuwe opdracht uit.

De volledige reeks voor een opdracht ziet er zo uit:

```
en
conf t
int gi0/3
ip add 10.42.7.1 255.255.255.0
no shut
end
wr
```

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

Onder het tandwiel rechtsboven kies je hoe je spel eruitziet. Drie losse keuzes die je vrij combineert: welke foto, welke ring eromheen en welke kleuren de pagina krijgt. Samen 34 dingen om vrij te spelen, en wat je eenmaal hebt houd je ook na het afstuderen.

### Portret

| Portret | Hoe je hem vrijspeelt |
|---|---|
| **Serge** — De foto zoals hij hoort. | Heb je vanaf het begin |
| **Archief** — Alsof hij al jaren aan de muur hangt. | Koop 25 upgrades |
| **Blauwdruk** — Serge als netwerktekening. | Bezit 250 apparaten tegelijk |
| **Neon** — Alle kleuren een slag harder. | Klik 50 gouden packets |
| **Nachtdienst** — Het serverlokaal om drie uur 's nachts. | Speel tussen drie en vier uur 's nachts |
| **Matrix** — Serge, gerenderd in groene regen. | Bereik een miljoen packets per seconde |
| **Röntgen** — Alles omgekeerd. Kijk er niet te lang naar. | Klik honderdduizend keer |
| **Poster** — Harde kleuren, zoals aan de muur van het lokaal. | Koop 75 upgrades |
| **Geëvolueerd** — De vorm die Serge aanneemt voorbij een miljard packets. | Verdien in totaal een miljard packets |

### Ring

| Ring | Hoe je hem vrijspeelt |
|---|---|
| **Blauw** — De vertrouwde rand. | Heb je vanaf het begin |
| **Goud** — Voor de gouden-packetjager. | Klik 25 gouden packets |
| **Cyaan** — De kleur van een werkende poort. | Zet een interface volledig goed op in de terminal |
| **Groen** — Uit de patchkast. | Ontdek je eerste protocol |
| **Indigo** — Voor wie het netwerk 's nachts laat doordraaien. | Kom terug na een uur weg te zijn geweest |
| **Roze** — Omdat het kan. | Haal 40 prestaties |
| **Wit** — Rustig, strak, klaar. | Bezit 500 apparaten tegelijk |
| **Terminalgroen** — De kleur van een console die het doet. | Typ de Konami-code |
| **Alarmrood** — Voor wie rode packets links laat liggen. | Negeer tien rode packets |
| **Koper** — Warm en ouderwets, net als UTP. | Klik 200 gouden packets |
| **Mat zwart** — Zoals elk rack in elk datacenter. | Bezit 1.000 apparaten tegelijk |
| **Regenboog** — Een ring die alle kleuren doorloopt. | Studeer één keer af |

### Achtergrond

| Achtergrond | Hoe je hem vrijspeelt |
|---|---|
| **Klaslokaal** — Het vertrouwde blauw. | Heb je vanaf het begin |
| **Mint** — Koel en fris, als een goed gekoelde gang. | Verdien in totaal een miljoen packets |
| **Vroege dienst** — Geel en roze, van voor de koffie. | Klik tienduizend keer |
| **Serverlokaal** — Donker, koel en groen verlicht. | Tien goede antwoorden op rij bij de overhoring |
| **Patchkast** — Het groen van een volle kabelgoot. | Ontdek vier protocollen |
| **Koper** — Warm, ouderwets en betrouwbaar. | Koop 50 upgrades |
| **Zonsondergang** — Roze tot paars, na een goede handelsdag. | Maak winst op de bandbreedtemarkt |
| **Staal** — Grijs op grijs, zoals het rack zelf. | Haal 100 prestaties |
| **Diepe ruimte** — Voorbij de laatste satelliet. | Koop je eerste singulariteit |
| **Oceaan** — Diep water, met een kabel erdoorheen. | Koop je eerste zeekabel |
| **Matrix** — Digitale regen, zwart met groen. Je weet waarom. | Voer rm -rf / uit in de terminal |
| **Nevel** — Paars en stil, ergens ver weg. | Verzamel 25 studiepunten |
| **Regenboog** — Alles tegelijk. Niet subtiel, wel verdiend. | Studeer één keer af |

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
| 📝 **Eerste overhoring** | Beantwoord een subnetvraag goed. |
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

