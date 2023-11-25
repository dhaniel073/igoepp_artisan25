import { Dimensions, Platform, StatusBar } from "react-native";

export const marginStyle = {
    marginTp: Platform.OS === 'android' ? StatusBar.currentHeight + 5 : 50
}

export const FontSize = {
    size_sm:14
}
export const Color = {
    new_color: '#005072',
    white: "#fff",
    light_black: '#D3D2D2',
    gray_100: "#828282",
    error100: '#fcdcbf',
    brown: '#f7a10d',
    error500: '#f37c13',
    grey2: "#97adb6",
    red: "red",
    orange_100: "#005072",
    mintcream: "rgba(0, 70, 80, 0.1)",
    black: "#3e4958",
    new_color: '#005072',
    new_color_100: "rgba(0, 80, 114, 0.6)",
    new_color_200: "rgba(0, 80, 114, 0.3)",
    darkslategray_100: "rgba(62, 73, 88, 0.6)",
    dimgray_100: "#707070",
    dimgray_200: "rgba(112, 112, 112, 0.9)",
    steelblue: "#0074ac",
    skyblue: "#9fe1ff",
    blueviolet: "#7619e0",
    mediumpurple: "#c79bff",
    limegreen_100: "#0eb90e",
    lightcoral: "#fe8a97",
    gray6: "#f2f2f2",
    gray_100: "#828282",
    gray_200: "rgba(0, 27, 41, 0.7)",
    crimson: "#d63031",
    darkolivegreen: "#1a4c1a",
    papayawhip: "#fcf2d9",
    black: "#000",
    tomato: "#ff5d2c",
    saddlebrown_100: "#6f4810",
    saddlebrown_200: "#6f4801",
    grey2: "#97adb6",
    silver: "#bdbdbd",
    firebrick_100: "#bb2222",
    firebrick_200: "#b22222",
}

export const Border = {
    br_3xs: 10
}

export const DIMENSION = {
    HEIGHT : Dimensions.get('window').height,
    WIDTH : Dimensions.get('window').width
}

export const TOKEN = `eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiOWFlYjQ5ZDdiN2RlMjM3ZTZjNGJkY2ExNTI1ZTdhNGM3NjY1MDM0NTg1MzhmMTg2MGVlMWI5ZWQ4NWUwNDMzNmFjMTlhYWZmZWE3OThiNjYiLCJpYXQiOjE2OTkwMTExODIsIm5iZiI6MTY5OTAxMTE4MiwiZXhwIjoxNzMwNjMzNTgyLCJzdWIiOiIxNTQiLCJzY29wZXMiOltdfQ.L7hyMSy0IU5C8APSG7K5A2cbjnvCye5-2tDc3ddjSOuPmWuo7760Xvp5FHbJJUt3HLMR-BQfgL8tFzee2AhswYvsgy0i6-nJbscurpzKXKitOU9g0vlRR1tWJL1BjXYitU1_gk4l54rur-0Mv_EiMxBP7SF3m56hMyRKJ_BUnxxiP7ZBBiSlp-My8y33tzJvVnR4f_m-ZIAuQvRepOmq_Kp9VzLIIVd42_MJG-2fzTKFaim5Swb__7t_QvKbtTA7dDVISJrccxioEoePmcIC2JS6Ik_pJtifRDNeaGJSsSWiVABfW0T_LYojHYCvu__Oc2FRUdb9fwpJmvkLbf8x7TNtmKGGvuz4xdzXAe6rFsSMgqMPtUzdQRmVJG-7xiqASvVEJ-YzDMUyaZu_IJIOoTevuSR08cMIxGnN_MEZV9VTXolQvT3QytPyYPkKbRSd1WtPurJnZVUQt9eQ-th-g9WzI_EpG9tVZecKTt9f_C9oQuvccAZaIyDStsn5CdDDYfWypsmWlsnPclaQ0aeBov-ohbkGrWOatDj9H7sRNonvzGDyYsWAFcFFS26Y7TVmc588j1_cBAJ4LlC2TTBU0peGv0xNOyjCeqNjZvxUjXkZHy1g0U-h93A8L4lN4oStYVN6dQfcFULLBEviSSJRX1A6Lcp1nX-2U0lqVc2TywI`