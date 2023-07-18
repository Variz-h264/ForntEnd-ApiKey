import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const ApiKeys = () => {
  const [apiData, setApiData] = useState<any[]>([]);

  useEffect(() => {
    render();
  },);

  const render = () => {
    axios
      .get("http://localhost:3001/v1/apikeys/")
      .then((response) => {
        const res = response.data;
        if (res.status) {
          setApiData(res.data);
        } else {
          ErrorMessage("เกิดข้อผิดพลาดในการดึงข้อมูล");
          console.log('render: ', res.message);
        }
      })
      .catch((error) => {
        ErrorMessage("เกิดข้อผิดพลาดในการเรียกใช้ API");
        console.log('render: ', error);

      });
  };

  const toggleApiKeyStatus = (apiKeyId: any, status: boolean, name: string, website: string, ip: string) => {
    Swal.fire({
      title: "ยืนยันการเปลี่ยนแปลงสถานะ",
      text: `คุณต้องการ${status ? "ปิด" : "เปิด"} API Key ของผู้ใช้ ${name} นี้หรือไม่?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(`http://localhost:3001/v1/apikeys/${apiKeyId}`, {
            status: status ? "offline" : "online",
            name,
            website,
            ip,
          })
          .then((response) => {
            const res = response.data;
            if (res.status) {
                SuccessMessage(`API Key ถูก${status ? "ปิด" : "เปิด"}แล้ว`)
                render();
            } else {
              ErrorMessage("เกิดข้อผิดพลาดในการเปลี่ยนแปลงสถานะ");
              console.log('ApiKeyStatus: ', res.message);
            }
          })
          .catch((error) => {
            ErrorMessage("เกิดข้อผิดพลาดในการเปลี่ยนแปลงสถานะ");
            console.log('ApiKeyStatus: ', error);
          });
      }
    });
  };

  const openEditModal = (apiKeyId: any, status: string) => {
    const selectedApiKey = apiData.find((item) => item.id === apiKeyId);

    Swal.fire({
      title: "แก้ไขข้อมูล",
      html: `
        <input type="text" id="editName" class="swal2-input" placeholder="ชื่อผู้ใช้" value="${selectedApiKey.name}">
        <input type="text" id="editWebsite" class="swal2-input" placeholder="Website" value="${selectedApiKey.website}">
        <input type="text" id="editIP" class="swal2-input" placeholder="IP" value="${selectedApiKey.ip}">
      `,
      confirmButtonText: "บันทึก",
      preConfirm: () => {
        const name = (document.getElementById("editName") as HTMLInputElement).value;
        const website = (document.getElementById("editWebsite") as HTMLInputElement).value;
        const ip = (document.getElementById("editIP") as HTMLInputElement).value;
        return {
          name: name.trim(),
          website: website.trim(),
          ip: ip.trim(),
        };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value !== undefined) {
        const { name, website, ip }: any = result.value;
        axios
          .put(`http://localhost:3001/v1/apikeys/${apiKeyId}`, {
            name,
            website,
            ip,
            status
          })
          .then((response) => {
            const res = response.data;
            if (res.status) {
              SuccessMessage(`แก้ไขข้อมูล Key ของ ${name} สำเร็จ`)
              render();
            } else {
              ErrorMessage("เกิดข้อผิดพลาดในการแก้ไขข้อมูล Key");
              console.log('EditApiKey: ', res.message);
            }
          })
          .catch((error) => {
            ErrorMessage("เกิดข้อผิดพลาดในการแก้ไขข้อมูล");
            console.log('EditApiKey: ', error);
          });
      }
    });
  };

  const deleteApiKey = (apiKeyId: number, name: string) => {
    Swal.fire({
      title: "ลบ API Key",
      text: "คุณต้องการลบ API Key นี้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:3001/v1/apikeys/${apiKeyId}`)
          .then((response) => {
            const res = response.data;
            if (res.status) {
              SuccessMessage(`ลบ Key ของ ${name} สำเร็จ`)
              render();
            } else {
              ErrorMessage("เกิดข้อผิดพลาดในการลบ Key");
              console.log('deleteApiKey', res.message);
            }
          })
          .catch((error) => {
            ErrorMessage("เกิดข้อผิดพลาดในการลบ Key");
            console.log('deleteApiKey: ', error);
          });
      }
    });
  };

  const createApiKey = () => {
    Swal.fire({
      title: "สร้าง API Key",
      html: `
        <input type="text" id="apiKeyName" class="swal2-input" placeholder="ชื่อผู้ใช้">
        <input type="text" id="apiKeyWebsite" class="swal2-input" placeholder="Website">
        <input type="text" id="apiKeyIP" class="swal2-input" placeholder="IP">
      `,
      confirmButtonText: "สร้าง",
      preConfirm: () => {
        const name = (document.getElementById("apiKeyName") as HTMLInputElement).value;
        const website = (document.getElementById("apiKeyWebsite") as HTMLInputElement).value;
        const ip = (document.getElementById("apiKeyIP") as HTMLInputElement).value;
        
        return {
          name: name.trim(),
          website: website.trim(),
          ip: ip.trim(),
        };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value !== undefined) {
        const { name, website, ip }: any = result.value;
        axios
          .post("http://localhost:3001/v1/apikeys/genApiKey/", {
            name,
            website,
            ip,
          })
          .then((response) => {
            const res = response.data;
            if (res.status) {
              SuccessMessage("สร้าง API Key สำเร็จ!!!");
              render();
            } else {
              ErrorMessage("เกิดข้อผิดพลาดในการสร้าง API Key");
              console.log('createApiKey: ', res.message);   
            }
          })
          .catch((error) => {
            ErrorMessage("เกิดข้อผิดพลาดในการสร้าง API Key");
            console.log('createApiKey: ', error);
          });
      }
    });
  };

  const SuccessMessage = (message: string) => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    Toast.fire({
      icon: 'success',
      title: message
    })
  };

  const ErrorMessage = (message: string) => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    Toast.fire({
      icon: 'error',
      title: message
    })
  };

  return (
    <div className="container mt-5">
      <h1 className="text-black fw-bold">
        WEB API V1 :{" "}
        <span className="text-primary fw-semibold">BY variz.h264</span>
      </h1>
      <div className="d-flex align-items-center justify-content-between">
        <h3>สร้าง API KEY</h3>
        <button onClick={createApiKey} className="btn btn-primary">
          <i className="fa fa-plus"></i>
        </button>
      </div>
      <hr />
        <div className="card card-body border-0 shadow-sm">
          <div>
            {apiData.map((item) => (
              <div key={item.id}>
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h3 className="fw-bold">
                      ชื่อผู้ใช้:{" "}
                      <span className="fw-semibold">{item.name}</span>
                    </h3>
                    <h3 className="fw-bold">
                      เว็บที่ใช้:{" "}
                      <span className="fw-semibold">{item.website}</span>
                    </h3>
                    <h3 className="fw-bold">
                      ip: <span className="fw-semibold">{item.ip}</span>
                    </h3>
                    <h3 className="fw-bold">
                      ApiKey: <span className="fw-semibold">{item.apiKey}</span>
                    </h3>
                  </div>
                  <div>
                    <button
                      type="button"
                      className={`btn me-2 ${
                        item.status === "online" ? "btn-primary" : "btn-dark"
                      } toggle-button`}
                      data-id={item.id}
                      data-status={item.status}
                      onClick={() =>
                        toggleApiKeyStatus(item.id, item.status === "online", item.name, item.website, item.ip)
                      }
                    >
                      {item.status === "online" ? (
                        <span><i className="fa fa-power-off" /></span>
                      ) : (
                        <span><i className="fa fa-ban" /></span>
                      )}
                    </button>

                    <button
                      type="button"
                      className="btn btn-warning edit-button me-2"
                      data-id={item.id}
                      onClick={() => openEditModal(item.id, item.status)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger delete-button"
                      onClick={() => deleteApiKey(item.id, item.name)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
                <hr />
              </div>
            ))}
          </div>
      </div>
    </div>
  );
};

export default ApiKeys;