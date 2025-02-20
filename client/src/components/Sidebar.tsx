import { useState } from "react";
import { motion } from "framer-motion";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import { links } from "@/constants/SidebarLinks";

export default function SidebarComp() {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
      <div
        className={`w-${open ? "64" : "16"} h-full transition-all duration-300`}
      >
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-col flex-1 overflow-y-auto">
              {open ? <Logo /> : <LogoIcon />}
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </div>
            </div>
            <div>
              <SidebarLink
                link={{
                  label: "Manoranjan Ingudam",
                  href: "#",
                  icon: (
                    <img
                      src="appeq_founder.jpeg"
                      className="h-7 w-7 flex-shrink-0 rounded-full"
                      width={50}
                      height={50}
                      alt="Avatar"
                    />
                  ),
                }}
              />
            </div>
          </SidebarBody>
        </Sidebar>
      </div>
    </div>
  );
}

export const Logo = () => {
  return (
    <a
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <img
        src="appeq_logo.avif"
        className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0"
        width={50}
        height={50}
        alt="Icon"
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        AppEQ.ai
      </motion.span>
    </a>
  );
};

export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <img
        src="appeq_logo.avif"
        className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0"
        width={50}
        height={50}
        alt="Avatar"
      />
    </a>
  );
};
