import React, { useState, useEffect, useRef } from "react";
import { Upload, Button, message, Image, Anchor, Col, Row } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { FiMenu } from "react-icons/fi";
import axios from "axios";
import icon from "./img/border_icon_rmuti.png";
import "./App.css";

import Corn_Brown_Spot from "../public/Corn_Brown_Spot.jpg";
import Corn_Common_Rust from "../public/Corn_Common_Rust.jpg";
import Corn_Downy_Mildew from "../public/Corn_Downy_Mildew.jpg";
import Corn_Large_Leaf_Blight from "../public/Corn_Large_Leaf_Blight.jpg";
import Corn_Leaf_Spot from "../public/Corn_Leaf_Spot.jpg";
import Corn_SCMV_MDMV from "../public/Corn_SCMV_MDMV.jpg";
import Corn_Small_Leaf_Blight from "../public/Corn_Small_Leaf_Blight.jpg";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const menuItems = [
  {
    label: "ความรู้เกี่ยวกับข้าวโพด",
    href: "https://www.doa.go.th/fc/nakhonsawan/?page_id=2321",
  },
  { label: "สำนักงานผู้เชี่ยวชาญ", href: "https://suwanfarm.agr.ku.ac.th/" },
  { label: "ติดต่อเรา", href: "https://www.rmuti.ac.th" },
];

function App() {
  const [fileList, setFileList] = useState([]);
  const [prediction, setPrediction] = useState([]);
  const [top3Predic, setTop3Predic] = useState([]);
  const [imageLink, setImageLink] = useState(null);
  const [numDetail, setNumDetail] = useState(0);
  const [nameDetail, setNameDetail] = useState("ไม่พบชื่อโรค");
  const [width, setWidth] = useState(window.innerWidth);

  // Dropdown
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // >>> เพิ่มเฉพาะสำหรับ content0 (ใช้เป็น container ให้ Anchor และสกรอลในกรอบ)
  const content0Ref = useRef(null);

  useEffect(() => {
    if (fileList.length === 0) {
      setNameDetail("");
      setNumDetail(null);
    }
  }, [fileList]);

  useEffect(() => {
    // ถ้า top3 เปลี่ยนเป็นชุดใหม่ ให้ล้าง detail เก่า
    setNameDetail("");
    setNumDetail(null);
  }, [top3Predic]);

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // handle resize
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const toggleMenu = () => setMenuOpen((v) => !v);

  const handleBeforeUpload = (file) => {
    const isAllowed = file.type === "image/jpeg" || file.type === "image/png";
    if (!isAllowed) {
      message.error("You can only upload JPG/PNG files!");
      return Upload.LIST_IGNORE;
    }
    return false; // prevent auto upload
  };

  const handleOnChange = async ({ file, fileList }) => {
    const raw = file.originFileObj || file;
    setImageLink(URL.createObjectURL(raw));
    setFileList(fileList);
    await handleUpload(raw);
  };

  const handleUpload = async (rawFile) => {
    try {
      const fd = new FormData();
      fd.append("image", rawFile, rawFile.name);

      const res = await axios.post(
        // "http://127.0.0.1:5000/predict",
        "https://api.3.107.174.93.sslip.io/predict",
        fd,
        { timeout: 120000 }
      );

      setPrediction(res.data || []);
      setTop3Predic((res.data || []).slice(0, 3));
    } catch (err) {
      message.error("อัปโหลดไม่สำเร็จ");
      console.error(err);
    }
  };

  // Card styles (no absolute)
  const contentLayout = {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "30%",
    height: "90%",
    margin: 16,
    borderRadius: 20,
    flexDirection: "column",
  };

  const contentTransparent = {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    width: 400,
    height: 400,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  };

  const contentresponsive = {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    width: 350,
    height: 350,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  };

  const contentResultRes = {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    width: 350,
    height: 350,
    borderRadius: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const detailCornDisease = {
        1: `โรคใบจุดสีน้ำตาล (Physoderma maydis)

    **ระยะและสภาพเสี่ยง:**  
    • มักเกิดในระยะต้นอ่อน–แตกใบ โดยเฉพาะแปลงที่มีน้ำขังหรือระบายน้ำไม่ดี  

    **วิธีสังเกตอาการ:**  
    • จุดเล็กสีเหลืองหรือน้ำตาล เรียงเป็นแถบขวางใบ  
    • มีจุดสีน้ำตาลหรือม่วงบนเส้นกลางใบหรือกาบใบ  
    • ใช้นิ้วถูไม่เป็นผง (ต่างจากโรคสนิม)  

    **สารเคมีและการใช้:**  
    • ส่วนมากไม่จำเป็นต้องพ่น หากไม่รุนแรง  
    • หากจำเป็น สามารถใช้สาร เช่น อะโซไซสโตรบิน (Azoxystrobin) หรือ ไพราคลอสโตรบิน (Pyraclostrobin)  
      - พ่นช่วงใบยังอ่อน ให้สารเคลือบทั้งสองด้านของใบ  
      - พ่นซ้ำทุก 10-14 วัน หากยังพบการระบาด  
      - ปฏิบัติตามอัตราที่ระบุบนฉลากยาอย่างเคร่งครัด  

    **การป้องกันฤดูถัดไป:**  
    • ปรับปรุงการระบายน้ำ  
    • เลือกพันธุ์ที่ทนโรค  
    • ไถกลบและทำลายเศษพืชหลังการเก็บเกี่ยว`,

        2: `โรคราสนิม (Puccinia sorghi)

    **ระยะและสภาพเสี่ยง:**  
    • พบบ่อยในสภาพชื้นต่อเนื่อง โดยเฉพาะช่วงก่อนออกดอก–เริ่มติดเมล็ด  

    **วิธีสังเกตอาการ:**  
    • มีตุ่มนูนสีน้ำตาล–ส้มทั้งสองด้านของใบ  
    • เมื่อใช้นิ้วรูดจะมีผงสปอร์ติดมือ  

    **สารเคมีและการใช้:**  
    • เริ่มพ่นเมื่อพบตุ่มสนิมบนใบหูฝักหรือใบด้านบน  
    • สารที่ใช้ได้ เช่น:  
      - อะโซไซสโตรบิน (Azoxystrobin)  
      - ไพราคลอสโตรบิน (Pyraclostrobin)  
      - ไตรฟลอกไซสโตรบิน (Trifloxystrobin)  
      - โพรพิคนาโซล (Propiconazole)  
      - เทบูโคนาโซล (Tebuconazole)  
      - ไดฟีโนโคนาโซล (Difenoconazole)  
    • วิธีพ่น: ให้เคลือบทั้งสองด้านของใบหูฝักและใบด้านบน ใช้น้ำตามปริมาณที่แนะนำในฉลาก (ประมาณ 200-400 ลิตรต่อไร่)  
    • พ่นซ้ำทุก 14 วัน และควรสลับชนิดของสารเพื่อป้องกันการดื้อยา  

    **การป้องกันฤดูถัดไป:**  
    • เลือกพันธุ์ที่ทนต่อโรค  
    • จัดการเศษพืชที่เหลือในแปลง  
    • วางแผนพ่นล่วงหน้าหากพื้นที่มีการระบาดซ้ำ`,

        3: `โรคราน้ำค้าง (Peronosclerospora sorghi)

    **ระยะและสภาพเสี่ยง:**  
    • พบบ่อยในสภาพอากาศร้อนชื้น ใบเปียกนาน มักเกิดตั้งแต่ต้นอ่อน  

    **วิธีสังเกตอาการ:**  
    • ใบมีลายซีดเป็นริ้วตามยาว สีเหลืองเขียวสลับ  
    • เห็นคราบขาวใต้ใบตอนเช้า  
    • ต้นเตี้ย แตกกอผิดปกติ  

    **สารเคมีและการใช้:**  
    • ไม่สามารถรักษาต้นที่เป็นโรคได้ ต้องถอนและทำลายทันที  
    • วิธีป้องกันสำคัญคือ “คลุกเมล็ดก่อนปลูก” เช่น:  
      - เมทาแลกซิล (Metalaxyl)  
      - เมฟีโนซาม (Mefenoxam)  
    • วิธีใช้: คลุกเมล็ดข้าวโพดให้ทั่วในอัตราที่ระบุบนฉลากก่อนปลูก  
    • หากต้องพ่นเสริม ต้องพ่นเชิงป้องกันตั้งแต่ต้นอ่อนเท่านั้น  

    **การป้องกันฤดูถัดไป:**  
    • ใช้พันธุ์ทน  
    • หมุนเวียนพืชหรือเว้นช่วงการปลูก  
    • ไถกลบเศษพืชเพื่อทำลายแหล่งเชื้อ`,

        4: `โรคใบจุด (Bipolaris zeicola)

    **ระยะและสภาพเสี่ยง:**  
    • มักเกิดในสภาพชื้นปานกลาง เริ่มจากใบล่างและไต่ขึ้น  

    **วิธีสังเกตอาการ:**  
    • จุดเล็กสีเทาน้ำตาล ขอบเข้ม  
    • หลายจุดอาจเชื่อมรวมกัน แต่ยังเล็กกว่าโรคใบไหม้  

    **สารเคมีและการใช้:**  
    • หากจำกัดอยู่แค่ใบล่าง มักไม่จำเป็นต้องพ่น  
    • หากโรคลามถึงใบหูฝัก ควรใช้สาร เช่น:  
      - อะโซไซสโตรบิน (Azoxystrobin)  
      - ไพราคลอสโตรบิน (Pyraclostrobin)  
      - โพรพิคนาโซล (Propiconazole)  
      - เทบูโคนาโซล (Tebuconazole)  
      - ฟลักซาพีรอกซาด (Fluxapyroxad)  
      - แมนโคเซบ (Mancozeb)  
      - คลอโรทาโลนิล (Chlorothalonil)  
    • วิธีพ่น: ให้สารเคลือบทั้งสองด้านของใบ เว้นระยะพ่น 10-14 วัน  

    **การป้องกันฤดูถัดไป:**  
    • เลือกพันธุ์ทน  
    • ไถกลบซังและเศษพืช  
    • ลดความหนาแน่นในการปลูก`,

        5: `โรคใบไหม้แผลเล็ก (Bipolaris maydis)

    **ระยะและสภาพเสี่ยง:**  
    • เกิดในอากาศอุ่นชื้น แปลงปลูกแน่น หรือปลูกซ้ำในที่เดิม  

    **วิธีสังเกตอาการ:**  
    • แผลสีน้ำตาล รูปสี่เหลี่ยมผืนผ้า ขอบแดงหรือเหลือง  
    • เริ่มจากใบล่างและลามขึ้นจนใบไหม้  

    **สารเคมีและการใช้:**  
    • หากโรคยังไม่ถึงใบหูฝัก สามารถควบคุมด้วยการเลือกพันธุ์และจัดการเศษพืช  
    • หากโรคขึ้นถึงใบหูฝัก ใช้สาร เช่น:  
      - อะโซไซสโตรบิน (Azoxystrobin)  
      - ไพราคลอสโตรบิน (Pyraclostrobin)  
      - โพรพิคนาโซล (Propiconazole)  
      - เทบูโคนาโซล (Tebuconazole)  
      - ฟลักซาพีรอกซาด (Fluxapyroxad)  
      - แมนโคเซบ (Mancozeb)  
      - คลอโรทาโลนิล (Chlorothalonil)  
    • วิธีพ่น: เริ่มพ่นเมื่อโรคขึ้นสู่ใบหูฝัก ให้เคลือบทั่วทั้งสองด้านของใบ พ่นซ้ำทุก 10-14 วัน  

    **การป้องกันฤดูถัดไป:**  
    • เลือกพันธุ์ทน  
    • ไถกลบและจัดการเศษพืชอย่างต่อเนื่อง`,

        6: `โรคใบไหม้แผลใหญ่ (Exserohilum turcicum)

    **ระยะและสภาพเสี่ยง:**  
    • พบมากในอากาศชื้นและเย็น เริ่มจากใบล่างและลามขึ้น โดยเฉพาะช่วงก่อนออกดอกถึงติดเมล็ด  

    **วิธีสังเกตอาการ:**  
    • แผลยาวรูปซิการ์ สีเทาน้ำตาล ขนานกับเส้นใบ  

    **สารเคมีและการใช้:**  
    • หากโรคเริ่มถึงใบหูฝัก ควรพ่นสาร เช่น:  
      - อะโซไซสโตรบิน (Azoxystrobin)  
      - ไพราคลอสโตรบิน (Pyraclostrobin)  
      - โพรพิคนาโซล (Propiconazole)  
      - เทบูโคนาโซล (Tebuconazole)  
      - ฟลักซาพีรอกซาด (Fluxapyroxad)  
    • วิธีพ่น: ให้เคลือบทั่วทั้งสองด้านของใบหูฝักและใบด้านบน พ่นซ้ำห่างกันประมาณ 14 วัน  

    **การป้องกันฤดูถัดไป:**  
    • ใช้พันธุ์ที่ทนโรค  
    • ไถกลบซังและเศษพืชหลังการเก็บเกี่ยว`,

        7: `โรคใบด่างจากไวรัส (SCMV และ MDMV)

    **ระยะและสภาพเสี่ยง:**  
    • อันตรายมากหากเกิดตั้งแต่ต้นอ่อน  
    • มีเพลี้ยอ่อนเป็นพาหะ และมีวัชพืชตระกูลหญ้ารอบแปลงเป็นแหล่งสะสมเชื้อ  

    **วิธีสังเกตอาการ:**  
    • ใบด่างเป็นปื้นหรือเส้น สีเขียวสลับเหลือง  
    • ต้นเตี้ย แตกกอมาก ใบสั้นผิดปกติ  
    • หากต้องการยืนยัน ควรตรวจในห้องปฏิบัติการ  

    **สารเคมีและการใช้:**  
    • ไม่มียาที่รักษาไวรัสโดยตรง  
    • การพ่นยาฆ่าแมลงไม่สามารถหยุดการแพร่ของเพลี้ยได้ทัน  
    • วิธีที่ดีที่สุดคือ ถอนและทำลายต้นป่วย และกำจัดวัชพืชรอบแปลง  

    **การป้องกันฤดูถัดไป:**  
    • ใช้พันธุ์ทนไวรัส  
    • กำจัดวัชพืชตระกูลหญ้าอย่างต่อเนื่อง  
    • ปลูกเหลื่อมฤดูเพื่อเลี่ยงช่วงที่เพลี้ยอ่อนชุก`,
  };



  return (
    <div style={{ height: "100vh" }}>
      {/* Navbar */}
      <div className="custom_navbar">
        <div className="navbar1">
          <img src={icon} alt="icon" style={{ width: 70, height: 70 }} />
        </div>

        <div className="navbar2">
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div className="nb21">
              <p
                style={{
                  color: "#5C4333",
                  textShadow: `
                    -1.5px -1.5px 0 #FFEBCD,
                    1.5px -1.5px 0 #FFEBCD,
                    -1.5px  1.5px 0 #FFEBCD,
                    1.5px  1.5px 0 #FFEBCD
                  `,
                }}
              >
                ระบบวินิจฉัยโรคในข้าวโพดด้วยการเรียนรู้เชิงลึกร่วมกับการประมวลผลภาพ
              </p>
            </div>
            {width < 769 ? null : (
              <div className="nb22">
                <p
                  style={{
                    fontWeight: 400,
                    color: "#5A3E1B",
                    textShadow: `
                      -1.2px -1.2px 0 #FFEBCD,
                      1.2px -1.2px 0 #FFEBCD,
                      -1.2px  1.2px 0 #FFEBCD,
                      1.2px  1.2px 0 #FFEBCD
                    `,
                  }}
                >
                  Corn Disease Diagnosis System Using Deep Learning and Image
                  Processing
                </p>
              </div>
            )}
          </div>

          {/* Menu */}
          <div className="nb23" style={{ position: "relative" }} ref={menuRef}>
            <FiMenu
              style={{
                width: 30,
                height: 30,
                cursor: "pointer",
                color: "#CC5500",
                margin: 10,
              }}
              onClick={toggleMenu}
              aria-label="menu"
            />
            {menuOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "75%",
                  right: 0,
                  marginTop: 6,
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  borderRadius: 10,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                  zIndex: 100,
                  width: 200,
                }}
                role="menu"
              >
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {menuItems.map((item, index, array) => (
                    <li
                      key={item.href}
                      style={{
                        borderBottom:
                          index !== array.length - 1
                            ? "1px solid #eee"
                            : "none",
                      }}
                      onClick={() => setMenuOpen(false)}
                    >
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "block",
                          padding: "10px 16px",
                          textDecoration: "none",
                          color: "#000",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#fdd180ff";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "transparent";
                        }}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="content">
        {/* content1 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "20px", // ระยะห่างระหว่าง content0 และ content1
            padding: "20px",
            flexDirection: width < 769 ? "column" : "row",
          }}
        >
          {/* >>> ซ้าย (content0) — แก้เฉพาะส่วนนี้เท่านั้น <<< */}
          {fileList.length === 0 && (
            <div
              className="content0"
              ref={content0Ref}
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.7)", // โปร่งใส
                borderRadius: "20px",
                padding: "20px",
                minHeight: "400px",
                maxHeight: "75vh", // จำกัดความสูงให้มีสกรอลภายใน
                overflowY: "auto", // สกรอลเฉพาะ content0
                scrollBehavior: "smooth", // เลื่อนนุ่มนวล
              }}
            >
              {/* หัวเรื่อง */}
              <h2
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  marginBottom: 12,
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                  whiteSpace: "normal",
                  color: "#5A3E1B",
                }}
              >
                ข้อมูลโรคของข้าวโพด
              </h2>

              {/* โครงสองคอลัมน์ภายในกรอบ (ซ้าย = เนื้อหา, ขวา = เมนู Anchor) */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: width < 992 ? "1fr" : "1fr 230px",
                  gap: 16,
                  alignItems: "start",
                }}
              >
                {/* ซ้าย: เนื้อหา 7 หัวข้อ + รูปตัวอย่างใต้ชื่อโรค */}
                <div>
                  {[
                    {
                      id: "sec-brown-spot",
                      title: "โรคใบจุดสีน้ำตาล",
                      image: Corn_Brown_Spot,
                      cause: "เชื้อรา Physoderma maydis",
                      symptom: "พบจุดสีน้ำตาลเข้มที่เส้นกลางใบ ใบอาจพับและไหม้",
                    },
                    {
                      id: "sec-rust",
                      title: "โรคราสนิม",
                      image: Corn_Common_Rust,
                      cause: "เชื้อรา Puccinia polysora",
                      symptom:
                        "เกิดตุ่มนูนของสปอร์สีน้ำตาลอ่อนบนใบทั้งด้านบนและล่าง หรือกาบใบ",
                    },
                    {
                      id: "sec-downy",
                      title: "โรคราน้ำค้าง",
                      image: Corn_Downy_Mildew,
                      cause: "เชื้อรา Peronosclerospora sorghi",
                      symptom:
                        "ใบมีลายสีเหลือง-เขียวอ่อน สลับสีเขียวแก่ เป็นทางยาว, มีผงเชื้อราสีขาวอมเทาที่ใต้ใบ, ต้นแคระแกร็น, ฝักขนาดเล็ก",
                    },
                    {
                      id: "sec-leaf-spot",
                      title: "โรคใบจุด",
                      image: Corn_Leaf_Spot,
                      cause: "เชื้อรา Bipolaris zeicola",
                      symptom:
                        "ใบมีจุดสีเหลืองและน้ำตาล หากปล่อยทิ้งไว้อาจกลายเป็นแผลไหม้",
                    },
                    {
                      id: "sec-small-blight",
                      title: "โรคใบไหม้แผลเล็ก",
                      image: Corn_Small_Leaf_Blight,
                      cause: "เชื้อรา Bipolaris maydis",
                      symptom:
                        "แผลขนาดเล็ก สีเหลืองอ่อนถึงสีเทา เกิดขึ้นบนใบก่อนจะขยายใหญ่ขึ้น",
                    },
                    {
                      id: "sec-large-blight",
                      title: "โรคใบไหม้แผลใหญ่",
                      image: Corn_Large_Leaf_Blight,
                      cause: "เชื้อรา Exserohilum turcicum (Bipolaris turcica)",
                      symptom:
                        "เกิดแผลขนาดใหญ่ สีเทาถึงสีน้ำตาลอ่อน ลุกลามตามแนวยาวของใบ จนใบแห้งตาย",
                    },
                    {
                      id: "sec-mosaic",
                      title: "โรคใบด่าง (ไวรัส SCMV&MDMV)",
                      image: Corn_SCMV_MDMV,
                      cause: "ไวรัส SCMV (Maize Dwarf Mosaic Virus)",
                      symptom:
                        "ใบข้าวโพดมีลายเขียวซีดสลับเข้ม, เป็นลายประจุดเหลือง, ยอดอ่อนสีเหลืองซีด, ต้นแคระแกร็น",
                    },
                  ].map((s, idx) => (
                    <div
                      key={s.id}
                      id={s.id}
                      style={{
                        background: "rgba(0,0,0,0.035)",
                        padding: 16,
                        borderRadius: 12,
                        marginTop: idx === 0 ? 0 : 12,
                      }}
                    >
                      {/* ชื่อโรค */}
                      <h4
                        style={{
                          margin: 0,
                          wordBreak: "break-word",
                          overflowWrap: "anywhere",
                          whiteSpace: "normal",
                        }}
                      >
                        {s.title}
                      </h4>

                      {/* รูปตัวอย่างใต้ชื่อโรค */}
                      {s.image && (
                        <img
                          src={s.image}
                          alt={s.title}
                          style={{
                            marginTop: 8,
                            width: "70%",
                            maxHeight: 170,
                            objectFit: "cover",
                            borderRadius: 8,
                            display: "block",
                          }}
                          loading="lazy"
                        />
                      )}

                      {/* สาเหตุ / อาการ */}
                      <p
                        style={{
                          margin: "8px 0 0",
                          wordBreak: "break-word",
                          overflowWrap: "anywhere",
                          whiteSpace: "normal",
                        }}
                      >
                        <u>สาเหตุ:</u> {s.cause}
                      </p>
                      <p
                        style={{
                          margin: "4px 0 0",
                          wordBreak: "break-word",
                          overflowWrap: "anywhere",
                          whiteSpace: "normal",
                        }}
                      >
                        <u>อาการ:</u> {s.symptom}
                      </p>
                    </div>
                  ))}
                </div>

                {/* ขวา: เมนู Anchor (ยึดอยู่ด้านบนของกรอบนี้) */}
                <div style={{ position: "sticky", top: 0 }}>
                  <Anchor
                    getContainer={() => content0Ref.current} // ให้เลื่อนภายใน content0
                    targetOffset={8}
                    items={[
                      {
                        key: "sec-brown-spot",
                        href: "#sec-brown-spot",
                        title: "โรคใบจุดสีน้ำตาล",
                      },
                      {
                        key: "sec-rust",
                        href: "#sec-rust",
                        title: "โรคราสนิม",
                      },
                      {
                        key: "sec-downy",
                        href: "#sec-downy",
                        title: "โรคราน้ำค้าง",
                      },
                      {
                        key: "sec-leaf-spot",
                        href: "#sec-leaf-spot",
                        title: "โรคใบจุด",
                      },
                      {
                        key: "sec-small-blight",
                        href: "#sec-small-blight",
                        title: "โรคใบไหม้แผลเล็ก",
                      },
                      {
                        key: "sec-large-blight",
                        href: "#sec-large-blight",
                        title: "โรคใบไหม้แผลใหญ่",
                      },
                      {
                        key: "sec-mosaic",
                        href: "#sec-mosaic",
                        title: "โรคใบด่าง (SCMV&MDMV)",
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
          )}

          {/* >>> จบการแก้เฉพาะ content0 <<< */}

          {/* 👉 ขวา (content1) */}
          <div
            className="content1"
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.7)",
              borderRadius: "20px",
              padding: "20px",
              minHeight: "400px",
              height: "75vh", // บังคับให้สูงเท่ากับ content0
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* เนื้อหา content1 (อัปโหลดรูป) */}
            {fileList.length >= 1 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Image src={imageLink} width={"70%"} />
                <br />
                <Button
                  type="primary"
                  danger
                  block
                  className="custom-clear-button"
                  style={{ marginTop: 24, width: 100, border: "none" }}
                  onClick={() => {
                    setFileList([]);
                    setPrediction([]);
                    setTop3Predic([]);
                    setNameDetail("");
                    setNumDetail(null);
                  }}
                >
                  ล้าง
                </Button>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Upload
                  beforeUpload={handleBeforeUpload}
                  onChange={handleOnChange}
                  fileList={fileList}
                  listType="picture-card"
                  style={{ width: "100%", height: "100%" }}
                >
                  <PlusOutlined /> Upload
                </Upload>
                <br />
                <p
                  className="content21"
                  style={{ color: "red", marginTop: 10, textAlign: "center" }}
                >
                  *คำแนะนำการอัปโหลดไฟล์ภาพ
                  <br />
                  1.อัปโหลดไฟล์ภาพนามสกุล JPG, JPEG หรือ PNG เท่านั้น
                  <br />
                  2.ขนาดไฟล์ไม่เกิน 10MB และความละเอียดไม่เกิน 1024*1024 พิกเซล
                </p>
              </div>
            )}
          </div>
        </div>

        {/* content2 */}
        <div
          className="content2"
          style={
            fileList.length >= 1
              ? width < 769
                ? contentResultRes
                : contentLayout
              : { display: "none" }
          }
        >
          {prediction.length > 0 && (
            <div style={{ marginTop: 20, textAlign: "left" }}>
              <h3>ค่าความเป็นไปได้ของโรค :</h3>
              <ul>
                {prediction.map((item) => (
                  <li key={item.ID}>
                    {item.nameTH}: {item.confidence} %
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* content3 */}
        {/* ✅ แสดง content3 เฉพาะเมื่ออัปโหลดแล้วเท่านั้น */}
        {/* แสดงเฉพาะเมื่อมีไฟล์อัปโหลดแล้ว */}
        {fileList.length > 0 && (
          <div
            className="content3"
            style={{
              ...(width < 769
                ? { ...contentResultRes, flexDirection: "column" }
                : contentLayout),

              // ✅ ใช้สกรอลเฉพาะตอนอยู่หน้า "รายละเอียด"
              ...(nameDetail
                ? {
                    maxHeight: "75vh",
                    overflowY: "auto",
                    scrollBehavior: "smooth",
                    WebkitOverflowScrolling: "touch",
                    overscrollBehavior: "contain",
                  }
                : {
                    // ✅ หน้าก่อนกดตรวจสอบ: ไม่มีสกรอลในกล่อง
                    overflow: "visible",
                  }),

              padding: 20,
              boxSizing: "border-box",
              borderTop: "1px solid transparent", // กัน margin-collapsing
              display: "flow-root",
              minHeight: 0,
            }}
          >
            {nameDetail ? (
              /* ---------- โหมดรายละเอียด ---------- */
              <div
                style={{
                  padding: 16,
                  background: "rgba(255,255,255,0.5)",
                  borderRadius: 12,
                  lineHeight: 1.6,
                  whiteSpace: "pre-line",
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                }}
              >
                <h4 style={{ margin: "0 0 10px 0" }}>{nameDetail}</h4>
                {detailCornDisease[numDetail]}

                <div style={{ marginTop: 20, textAlign: "center" }}>
                  <button
                    onClick={() => {
                      setNumDetail(null);
                      setNameDetail("");
                      const el = document.querySelector(".content3");
                      if (el) el.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 8,
                      border: "none",
                      background: "#4ea0feff",
                      color: "#fff",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    ย้อนกลับ
                  </button>
                </div>
              </div>
            ) : (
              /* ---------- หน้าก่อนกดตรวจสอบ: จัดกลางและไม่มีสกรอล ---------- */
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  minHeight: "60vh", // แค่ให้ดูอยู่กลาง ๆ หน้าการ์ด ไม่ทำให้เกิดสกรอลในกล่อง
                  gap: 12,
                }}
              >
                <h3 style={{ margin: 0 }}>วิธีการรักษาจากโรค 3 อันดับแรก</h3>

                <div style={{ lineHeight: 1.8 }}>
                  {top3Predic.map((item, index) => (
                    <div key={index} style={{ marginBottom: 8 }}>
                      {item.nameTH}{" "}
                      <span
                        style={{ cursor: "pointer", color: "blue" }}
                        onClick={() => {
                          setNumDetail(item.ID);
                          setNameDetail(item.nameTH);
                        }}
                      >
                        ตรวจสอบ
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
