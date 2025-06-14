"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SchedaSaAl() {
  const [forma, setForma] = useState("base");
  const [hp, setHp] = useState(2000);
  const [focus, setFocus] = useState(10);
  const [equip, setEquip] = useState({
    arma: "Zweihänder Aurea",
    armatura: "Tunica Strappata",
    stivali: "Passi del Silenzio",
  });

  const forme = {
    base: {
      nome: "Forma Base",
      bonus: "Nessun potenziamento attivo",
    },
    aurea: {
      nome: "Forma Aurea",
      bonus:
        "+200 HP, volo, accesso alle 10 armi auree, interazione con strutture auree, potenziale 500+ danni",
    },
  };

  const armiAuree = [
    "Cannone Aureo",
    "Katar x2",
    "Macuahit",
    "Bolas",
    "Chakram Aurei",
    "Zhanmadao",
    "Shotel",
    "Lunga Urumi",
    "Mambele",
    "Zweihänder Aurea",
  ];

  const armature = [
    "Tunica Strappata",
    "Armatura di Fiamma",
    "Mantello dell'Eco",
  ];

  const stivali = [
    "Passi del Silenzio",
    "Stivali Aurei",
    "Piedi del Vuoto",
  ];

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">Scheda di Sa'Al</h1>
      <Tabs defaultValue="base">
        <TabsList>
          <TabsTrigger value="base" onClick={() => setForma("base")}>Base</TabsTrigger>
          <TabsTrigger value="aurea" onClick={() => setForma("aurea")}>Aurea</TabsTrigger>
        </TabsList>

        <TabsContent value="base">
          <Card>
            <CardContent className="space-y-4 pt-4">
              <h2 className="text-xl 
              font-semibold">{forme[forma].nome}</h2>
              <p>{forme[forma].bonus}</p>
              <div>
                <p>HP:</p>
                <Progress value={(hp / 2000) * 100} className="w-full" />
                <p>{hp} / 2000</p>
              </div>
              <div>
                <p>Focus:</p>
                <Progress value={(focus / 10) * 100} className="w-full" />
                <p>{focus} / 10</p>
              </div>
              <Button onClick={() => {
                setHp(hp - 100);
                setFocus(focus - 1);
              }}>Usa abilità</Button>
              <div className="space-y-2">
                <h3 className="font-medium">Equipaggiamento</h3>
                <p>🗡 Arma: {equip.arma}</p>
                <Select onValueChange={(value) => setEquip({ ...equip, arma: value })}>
                  <SelectTrigger><SelectValue placeholder="Scegli Arma" /></SelectTrigger>
                  <SelectContent>
                    {armiAuree.map((arma) => (
                      <SelectItem key={arma} value={arma}>{arma}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p>🛡 Armatura: {equip.armatura}</p>
                <Select onValueChange={(value) => setEquip({ ...equip, armatura: value })}>
                  <SelectTrigger><SelectValue placeholder="Scegli Armatura" /></SelectTrigger>
                  <SelectContent>
                    {armature.map((item) => (
                      <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p>👢 Stivali: {equip.stivali}</p>
                <Select onValueChange={(value) => setEquip({ ...equip, stivali: value })}>
                  <SelectTrigger><SelectValue placeholder="Scegli Stivali" /></SelectTrigger>
                  <SelectContent>
                    {stivali.map((item) => (
                      <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aurea">
          <Card>
            <CardContent className="space-y-4 pt-4">
              <h2 className="text-xl font-semibold">{forme[forma].nome}</h2>
              <p>{forme[forma].bonus}</p>
              <div>
                <p>HP:</p>
                <Progress value={(hp / 2200) * 100} className="w-full" />
                <p>{hp} / 2200</p>
              </div>
              <div>
                <p>Focus:</p>
                <Progress value={(focus / 10) * 100} className="w-full" />
                <p>{focus} / 10</p>
              </div>
              <div>
                <h3 className="font-medium">Armi Disponibili:</h3>
                <ul className="list-disc list-inside">
                  {armiAuree.map((arma) => (
                    <li key={arma}>{arma}</li>
                  ))}
                </ul>
              </div>
              <Button onClick={() => {
                setHp(hp - 150);
                setFocus(focus - 2);
              }}>Attiva arma aurea</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}