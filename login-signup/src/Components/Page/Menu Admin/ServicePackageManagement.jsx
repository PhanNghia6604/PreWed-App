import React, { useEffect, useState } from "react";
import ServicePackageForm from "./ServicePackageForm";
import ServicePackageEdit from "./ServicePackageEdit";
import styles from "./ServicePackageManagement.module.css";

const ServicePackageManagement = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPackage, setEditingPackage] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token không tồn tại, vui lòng đăng nhập lại.");
        return;
      }

      try {
        const res = await fetch("/api/servicepackage", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Lỗi khi lấy dữ liệu gói dịch vụ");
        const data = await res.json();
        setPackages(data);
      } catch (error) {
        console.error("Error fetching service packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa gói dịch vụ này?")) {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token không tồn tại, vui lòng đăng nhập lại.");
        return;
      }

      try {
        const res = await fetch(`/api/servicepackage/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Lỗi khi xóa gói dịch vụ");
        setPackages(packages.filter((pkg) => pkg.id !== id));
      } catch (error) {
        console.error("Error deleting package:", error);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Quản lý gói dịch vụ</h2>
      <ServicePackageForm setPackages={setPackages} />
      {editingPackage && (
        <ServicePackageEdit
          packageData={editingPackage}
          setPackages={setPackages}
          setEditingPackage={setEditingPackage}
        />
      )}
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Tên gói</th>
              <th>Mô tả</th>
              <th>Giá</th>
              <th>Thời gian</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg.id}>
                <td>{pkg.name}</td>
                <td>{pkg.description}</td>
                <td>{pkg.price}</td>
                <td>{pkg.duration} phút</td>
                <td>
                  <button
                    className={styles.editButton}
                    onClick={() => setEditingPackage(pkg)}
                  >
                    Sửa
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(pkg.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ServicePackageManagement;
