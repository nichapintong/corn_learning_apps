import React, { useState, useEffect, useRef } from "react";
import { Upload, Button, message, Image } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import icon from "./img/border_icon_rmuti.png";
import axios from "axios";
import "./App.css";
import { FiMenu } from "react-icons/fi";

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

  // เพิ่ม state สำหรับ dropdown menu
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null); // ✅ ref to detect outside click

  // ✅ ปิดเมนูเมื่อคลิกนอกเมนู
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Handler for resize
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup when component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleMenuClick = (option) => {
    alert(`เลือกเมนู: ${option}`);
    setMenuOpen(false);
  };

  const handleBeforeUpload = (file) => {
    const isAllowed = file.type === "image/jpeg" || file.type === "image/png";
    if (!isAllowed) {
      message.error("You can only upload JPG/PNG files!");
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  const handleOnChange = async ({ file, fileList }) => {
    setImageLink(URL.createObjectURL(file));
    setFileList(fileList);
    await handleUpload(file);
  };

  const handleUpload = async (imageData) => {
    if (!imageData) {
      alert("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageData);

    try {
      const response = await axios.post(
        "https://3.27.181.193:5000/predict",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setPrediction(response.data);
      setTop3Predic(response.data.slice(0, 3));
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const detailCornDisease = {
    1: "วิธีการรักษาคือ ใช้สารกลุ่ม Strobilurin เช่น Azoxystrobin, Pyraclostrobin หรือ Trifloxystrobin ใช้สารกลุ่ม Triazole เช่น Propiconazole หรือ Tebuconazole ฉีดพ่นสารเคมีก่อนมีการระบาดหนัก หรือเมื่อพบอาการในระยะแรก ควรสลับกลุ่มสารเคมีเพื่อลดการดื้อยาของเชื้อรา ใช้เชื้อจุลินทรีย์ป้องกันเชื้อรา เช่น Trichoderma harzianum หรือ Bacillus subtilis ฉีดพ่นเพื่อยับยั้งการเติบโตของเชื้อรา",
    2: "วิธีการรักษาคือ หมั่นตรวจไร่อยู่เสมอตั้งแต่ระยะกล้าเมื่อเริ่มพบโรคระบาดมีจุดสนิม 3-4 จุดต่อใบ สารที่ยูนิไลฟ์แนะนำ บิซโทร 30-40 กรัม หรือ ไมโครบลูคอป  20  กรัม  หรือ รัสโซล 20 ซีซี ต่อน้ำ 20 ลิตร พ่นทุก 7 วัน จำนวน 2 ถึง 4 ครั้ง ตามความรุนแรงของโรค",
    3: "วิธีการรักษาคือ ใช้สารป้องกันกำจัดเชื้อรา เช่น เมทาเลกซิล (Metalaxyl) หรือสารในกลุ่มฟีนิลเอไมด์ (Phenylamide) ฉีดพ่นในช่วงเริ่มต้นของการปลูก หรือเมื่อเริ่มพบอาการของโรค",
    4: "วิธีการรักษาคือ ใช้สารป้องกันเชื้อรา เช่น แมนโคเซ็บ (Mancozeb) หรือ โปรคลอราซ (Prochloraz) ฉีดพ่นสารตามคำแนะนำของผู้เชี่ยวชาญ",
    5: "วิธีการรักษาคือ ใช้เมล็ดพันธุ์จากต้นที่สมบูรณ์ปราศจากโรค หมั่นตรวจไร่อยู่เสมอ ตั้งแต่ระยะกล้า เมื่อโรคเริ่มระบาดประกอบกับมีสภาพแวดล้อมเหมาะสมต่อการเกิดโรคต่อเนื่องหลายวัน ให้พ่นด้วยสารป้องกันกำจัดโรคพืชไตรโฟรีน (ซาพรอล) อัตรา 20 ซีซี ต่อน้ำ 20 ลิตร ทำลายเศษซากของข้าวโพดหลังเก็บเกี่ยว",
    6: "วิธีการรักษาคือ ใช้สารป้องกันกำจัดเชื้อรา เช่น แมนโคเซบ (Mancozeb) หรือ คาร์เบนดาซิม (Carbendazim) พ่นสารในช่วงเริ่มต้นของการระบาด",
    7: "วิธีการรักษาคือ คลุกเมล็ดก่อนปลูก ด้วย Imidacloprid หรือ Thiamethoxam เพื่อลดปริมาณแมลงตั้งแต่เริ่มต้น ฉีดพ่นป้องกันแมลงพาหะ ทุก 7-10 วันในช่วงต้นอ่อนด้วย Lambda-cyhalothrin หรือ Deltamethrin ฉีดพ่นซ้ำเมื่อพบการระบาดของเพลี้ยอ่อน ใช้สารจากกลุ่มนีโอนิโคตินอยด์หรือไพรีทรอยด์ ใช้สารชีวภาพ สลับกับสารเคมีเพื่อลดการดื้อยา เช่น Beauveria bassiana",
  };

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
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,

  };

  const contentresponsive = {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    width: 350,
    height: 350,
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  };


  return (
    <div style={{ height: "100vh" }}>
      <div className="custom_navbar">
        <div className="navbar1">
          <img
            src={icon}
            alt="icon"
            style={{ width: "70px", height: "70px" }}
          />
        </div>
        <div className="navbar2">
          <div style={{height: "100%", display: "flex", flexDirection: "column", justifyContent: "center"}}>
            <div className="nb21">
              <p
                style={{
                  // fontSize: 25,
                  // fontWeight: "400",
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
            {width < 769 ? (
              ""
            ) : (
              <div className="nb22">
                <p
                  style={{
                    // fontSize: 20,
                    fontWeight: "400",
                    color: "	#5A3E1B",
                    textShadow: `
                    -1.2px -1.2px 0 #FFEBCD,
                    1.2px -1.2px 0 #FFEBCD,
                    -1.2px  1.2px 0 #FFEBCD,
                    1.2px  1.2px 0 #FFEBCD
                  `,
                  }}
                >
                  Corn disease diagnosis system using deep learning and
                  imageprocessing
                </p>
              </div>
            )}
          </div>
          <div
            className="nb23"
            style={{ position: "relative" }} // เพื่อให้ dropdown อยู่ตำแหน่งถูกต้อง
          >
            <FiMenu
              style={{
                width: "30px",
                height: "30px",
                cursor: "pointer",
                color: "#CC5500",
              }}
              onClick={toggleMenu}
            />
            <div
              className="nb23"
              style={{ position: "relative" }}
              ref={menuRef}
            >
              {menuOpen && (
                <div
                  ref={menuRef}
                  style={{
                    position: "absolute",
                    top: "150%",
                    marginTop: "6px",
                    right: 0,
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    borderRadius: "10px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    zIndex: 100,
                    width: "200px",
                  }}
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
      </div>

      <div className="content">
        <div
          className="content1"
          style={
            fileList.length >= 1
              ? contentLayout
              : width < 500
              ? contentresponsive
              : contentTransparent
          }
        >
          {fileList.length >= 1 ? (
            <>
              <Image src={imageLink} width={"70%"} />
              <Button
                type="primary"
                danger
                block
                className="custom-clear-button"
                style={{
                  marginTop: 24,
                  width: 100,
                  border: "none",
                }}
                onClick={() => {
                  setFileList([]);
                  setPrediction([]);
                  setTop3Predic([]);
                }}
              >
                ล้าง
              </Button>
            </>
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
                style={{
                  color: "red",
                  marginTop: 10,
                  textAlign: "center",
                }}
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

        <div
          className="content2"
          style={fileList.length >= 1 ? contentLayout : { display: "none" }}
        >
          {prediction.length > 0 && (
            <div style={{ marginTop: "20px", textAlign: "left" }}>
              <h3>ค่าความเป็นไปได้ของโรค :</h3>
              <ul>
                {prediction.map((item) => (
                  <li key={item.ID}>
                    {item.nameTH}: {item.confidence} {"%"}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div
          className="content3"
          style={fileList.length >= 1 ? contentLayout : { display: "none" }}
        >
          <h3>วิธีการรักษาจากโรค 3 อันดับแรก</h3>
          {top3Predic.map((item, index) => (
            <div key={index}>
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
          <br />
          <div style={{ padding: 20 }}>
            <b>{nameDetail}</b>
            <br />
            {detailCornDisease[numDetail] || "โปรดกดตรวจสอบ"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
