"use client";

import { useQuery } from "react-query";
import { get } from "../app_packages/http-client";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { IoMdShareAlt } from "react-icons/io";
import { useState } from "react";
import ReactDOM from "react-dom";
import html2canvas from "html2canvas";
import QRCode from "react-qr-code";

const center = "flex justify-center items-center";
const right = "flex justify-end items-end right-0";

export default function ThermalView() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { data: thermal } = useQuery(["Thermal"], () =>
    get("/Sale/printThermal/" + id)
  );
  const split = thermal?.print.split("\n");
  // console.log(split, "line");

  // console.log(thermal, "log");
  const width =
    thermal?.width < 43
      ? "w-[192px]"
      : thermal?.width < 80
      ? "w-[288px]"
      : "w-full";


  // const handleShare = () => {
  //   const data = encodeURIComponent(`image:${imageUrl}`);
  //   const whaturl = `https://wa.me/?text=${data}`;
  //   // window.open(whaturl, "_blank");
  //   window.print();
  // };
  const [show, setShow] = useState(true);

  const clicktoShare = () => {
    html2canvas(document.querySelector("#capture")!).then((canvas) => {
      const imageDataURL = canvas.toDataURL("image/png");
      canvas.toBlob((blob) => {
        const file = blob && new File([blob], "image.jpg", { type: blob.type });
        const shareData = {
          title:"Hisabuk",
          text: "invoice shared from hisabuk",
          url: imageDataURL,
        }as any
        try {
          if (navigator.share === undefined) {
            console.log("share error");
            if('Android' in window){
              console.log("android");
             (window.Android as any).nativeShare(shareData.title,shareData.text,shareData.url);
            }
            return;
          } else {
            console.log("share ok");
            file &&
            navigator.share(shareData);
          }
          
        } catch (error) {
          // handleShareError(`Error sharing: ${error}`);
        }
      });

      //document.body.appendChild(canvas);
      
      //document.write('<img src="' + imageDataURL + '"/>');
      //dv- const link = document.createElement("a");
      // link.download = "invoice_" + id + ".png";
      // link.href = canvas.toDataURL();
      // link.click();

      //link.delete;
      //window.open(imageDataURL);
      //const shareUrl = `https://wa.me/?send?text=Check%20out%20this%20image&media=${imageDataURL}`;
      //window.location.href = shareUrl;
    });
  };


  return (
    <>
      <div
        id="capture"
        className={`w-full h-auto bg-white flex flex-col justify-center items-center pt-1`}
      >
        {show && (
          <div className="w-[50px] h-[50px] justify-end items-end">
            <div className="w-[50px] h-[50px] justify-end items-end right-0">
              <button
                id="captureButton"
                onClick={() => {
                  setShow(false);
                  clicktoShare();
                  // handleShare()
                }}
                className="flex flex-row justify-center items-center"
              >
                <IoMdShareAlt className="" />
              </button>
            </div>
          </div>
        )}

        <div className={`${width} h-full`}>
          {split?.map((x: string, index: number) => {
            var final: any;
            // console.log(x, "before");

            var class_Name = x.startsWith("[C]")
              ? center
              : x.startsWith("[R]")
              ? right
              : "";
            x = x
              .replace(/^(\[L\])/, "")
              .replace(/^(\[C\])/, "")
              .replace(/^(\[R\])/, "");

            if (x.startsWith("<img")) {
              x = x.replace("<img>", "").replace("</img>", "");
              final = (
                <Image
                  src={"data:image/gif;base64," + x}
                  alt=""
                  width={100}
                  height={50}
                />
              );
              x = "";
            }

            if (x.startsWith("<qrcode")) {
              x = x.replace("<qrcode>", "").replace("</qrcode>", "");
              final = <QRCode value={x} className="w-[100px] h-[100px]"/>;
              x = "";
            }

            if (x.startsWith("<ar")) {
              x = x.substring(x.indexOf(">") + 1, x.length);
              x = x.substring(0, x.indexOf("</"));
            }
            var y = x.split("[");
            if (y.length > 1) {
              final = y.map((s: string) => {
                var class_Name2 = s.startsWith("C]")
                  ? center
                  : s.startsWith("R]")
                  ? right
                  : "";
                s = s
                  .replace(/^(L\])/, "")
                  .replace(/^(C\])/, "")
                  .replace(/^(R\])/, "");
                if (s.startsWith("<b>")) {
                  s = s.replace("<b>", "").replace("</b>", "");
                  class_Name += " font-bold";
                }
                if (s.startsWith("<font")) {
                  s = s.substring(s.indexOf(">") + 1, s.length);
                  s = s.substring(0, s.indexOf("</font>"));
                }
                if (s.startsWith("<b>")) {
                  s = s.replace("<b>", "").replace("</b>", "");
                  class_Name += " font-bold";
                }
                return (
                  <div className={`${class_Name2} w-full h-auto `}>
                    <p>{s}</p>
                  </div>
                );
              });
              x = "";
            }
            if (x.startsWith("<b>")) {
              x = x.replace("<b>", "").replace("</b>", "");
              class_Name += " font-bold";
            }
            if (x.startsWith("<font")) {
              x = x.substring(x.indexOf(">") + 1, x.length);
              x = x.substring(0, x.indexOf("</font>"));
            }

            if (x.startsWith("<b>")) {
              x = x.replace("<b>", "").replace("</b>", "");
              class_Name += " font-bold";
            }
            return (
              <div key={index} className="w-full h-auto flex flex-col justify-center ">
                <div className="" key={index}>
                  <p className={`${class_Name} flex flex-row text-[12px]`}>
                    {final}
                    {x}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        {/* <div className="bg-white p-2">
          <QRCode className="w-[100px] h-[100px]" value="hey" />
        </div> */}
      </div>
    </>
  );
}
