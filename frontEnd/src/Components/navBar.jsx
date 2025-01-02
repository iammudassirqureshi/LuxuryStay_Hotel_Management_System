import { MdEmail } from "react-icons/md";
import { FaFacebookF, FaPhoneAlt, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { IoIosMenu } from "react-icons/io";
import { useEffect, useState } from "react";
import { Button, Drawer } from "antd";
import logo from "../assets/WebLogo/Luxury Stay 1.png";
import "../HomeBanner.css";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <header
        className={`navbar lg:px-24 ${
          scrolled ? "bg-white text-white" : "bg-transparent"
        } fixed top-0 left-0 w-full z-50 transition-colors duration-300`}
      >
        {!scrolled && (
          <div className="header top px-10">
            <div className="lg:flex grid-cols-1 py-2 items-center lg:justify-between border-b border-gray-400">
              <div className="flex justify-center lg:items-center gap-10 text-white">
                <div className="Email text-[13px] flex items-center gap-2">
                  <span>
                    <MdEmail />
                  </span>
                  <span>example@gmail.com</span>
                </div>
                <div className="Phone text-[13px] flex items-center gap-2">
                  <span>
                    <FaPhoneAlt />
                  </span>
                  <span>+0123456789</span>
                </div>
              </div>

              <div className="lg:flex text-[16px] hidden justify-center lg:items-center py-2 lg:py-3 gap-5">
                <span className="hover:text-[#BAB86C] text-white">
                  <FaFacebookF />
                </span>
                <span className="hover:text-[#BAB86C] text-white">
                  <FaXTwitter />
                </span>
                <span className="hover:text-[#BAB86C] text-white">
                  <FaInstagram />
                </span>
              </div>
            </div>
          </div>
        )}

        <nav className="px-10 flex justify-between items-center bg-transparent py-2 lg:py-0">    
          <div className="lg:w-fit">
            <img src={logo} alt="logo" className=" lg:w-[150px] lg:h-fit h-24" />
          </div>

          <div className="lg:flex hidden items-center space-x-5 lg:text-md font-medium">
            {[
              { label: "Home", path: "/" },
              { label: "Rooms", path: "/Rooms" },
              { label: "Accommodation", path: "/Accommodation" },
              { label: "Gallery", path: "/Gallery" },
              { label: "About us", path: "/about-us" },
              { label: "Contact us", path: "/Contact" },
            ].map((item, index) => (
              <Link
                key={index}
                to={item.path} 
              >
                <span
                  className={`${
                    scrolled
                      ? "text-white hover:text-[#BAB86C]"
                      : "text-[white] hover:text-[#BAB86C]"
                  } hover:border-b-4 text-white hover:border-double hover:border-current outline-none`}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
          <div>
            <button className="bg-[#BAB86C] lg:block items-center hidden text-white font-medium px-5 py-2 rounded-md">
                <span className="">Reservation</span>
            </button>
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden py-6 px-5">
            <Button
              type="submit"
              style={{
                color: "#BAB86C",
                border: "1px solid #BAB86C",
                padding: "7px 7px",
                fontSize: "25px",
              }}
              onClick={showDrawer}
            >
              <IoIosMenu />
            </Button>
            <Drawer title="Luxury Stay" className="text-[#BAB86C]" onClose={onClose} open={open}>
              <nav className="small flex text-[20px] flex-col space-y-4 px-5">
                {[
                  "Home",
                  "Help Centre",
                  "Our Partners",
                  "About us",
                  "Register",
                ].map((item, index) => (
                  <Link
                    key={index}
                    to="#"
                    onClick={onClose}
                    className="hover:text-[#BAB86C]"
                  >
                    <span>{item}</span>
                  </Link>
                ))}
              </nav>

              <div className="text-[20px] flex items-center py-10 gap-5">
                <span className="hover:text-[#BAB86C]">
                  <FaFacebookF />
                </span>
                <span className="hover:text-[#BAB86C]">
                  <FaXTwitter />
                </span>
                <span className="hover:text-[#BAB86C]">
                  <FaInstagram />
                </span>
              </div>
            </Drawer>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
