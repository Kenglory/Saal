// src/lib/getRouteForUser.ts
export const getRouteForUser = (uid: string): string => {
  switch (uid) {
    case "6AZiZ2L1NcWBL50z7owZ31WfPAQ2":
      return "/dashboard/samuele";
    case "UID_MATTEO":
      return "/dashboard/matteo";
    case "UID_DAVIDE":
      return "/dashboard/davide";
    case "9P7mA8C6bFa4SmZXgeJtnGCbYOz1":
      return "/dashboard/stefano";
    case "UID_OLIVER":
      return "/dashboard/oliver";
    case "wnH3xIRZ2IduUf80f2p8ymTwg0N2":
      return "/dashboard/jacopo";
    case "UID_ANTONIO":
      return "/dashboard/master";
    case "AV6Of157a7TA6oRRdcOjDo63rSr2":
      return "/dashboard/matteo2";
    default:
      return '/dashboard/${uid}'; // fallback per nuovi utenti o test
  }
};
