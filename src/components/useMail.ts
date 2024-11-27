import { mails } from "@/models/data";
import { EmailAlias } from "@/models/email_aliases";
import { atom, useAtom } from "jotai";

type Config = {
  selected: EmailAlias["id"] | null;
};

const configAtom = atom<Config>({
  selected: mails[0].id,
});

export function useEmailAlias() {
  return useAtom(configAtom);
}
