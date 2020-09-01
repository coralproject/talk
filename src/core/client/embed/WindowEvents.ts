import PymControl from "./PymControl";

export default function hookUpWindowEvents(pym: PymControl) {
  window.addEventListener("keypress", (e) => {
    const payload = {
      event: "keypress",
      data: {
        code: e.code,
        key: e.key,
        charCode: e.charCode,
      },
    };

    pym.sendMessage("message", JSON.stringify(payload));
  });
}
