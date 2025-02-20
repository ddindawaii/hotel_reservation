import axios from "axios";
import Cookies from "js-cookie";

const AUTH_TOKEN = 'auth_token';
const REFRESH_TOKEN = 'refresh_token';
const ROLE = 'role';

export const setToken = (token) => {
  Cookies.set(AUTH_TOKEN, token);
};
export const getToken = () => Cookies.get(AUTH_TOKEN);
export const removeToken = () => Cookies.remove(AUTH_TOKEN);

export const setRefreshToken = (token) => {
  Cookies.set(REFRESH_TOKEN, token);
};
export const getRefreshToken = () => Cookies.get(REFRESH_TOKEN);
export const removeRefreshToken = () => Cookies.remove(REFRESH_TOKEN);

export const setRole = (role) => {
  Cookies.set(ROLE, role);
}
export const getRole = () => Cookies.get(ROLE);
export const removeRole = () => Cookies.remove(ROLE);



export const httpService = axios.create({
  // baseURL: 'https://api.escuelajs.co/api/v1',
  baseURL: 'http://172.16.148.101:8882/api/v1',
});



// // **Tambahkan interceptor untuk menyisipkan token pada setiap permintaan**
// httpService.interceptors.request.use(
//   (config) => {
//     const token = getToken();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // **Tambahkan interceptor untuk memperbarui token secara otomatis**
// httpService.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // Periksa jika token sudah kedaluwarsa
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       const refreshToken = getRefreshToken();
//       if (refreshToken) {
//         try {
//           const { data } = await axios.post(
//             'https://api.escuelajs.co/api/v1/auth/refresh',
//             { refreshToken }
//           );

//           // Simpan token baru
//           setToken(data.accessToken);
//           setRefreshToken(data.refreshToken);

//           // Perbarui permintaan asli
//           originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
//           return httpService(originalRequest);
//         } catch (err) {
//           // Jika refresh token gagal, hapus token yang ada
//           removeToken();
//           removeRefreshToken();
//           return Promise.reject(err);
//         }
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default httpService;
export default httpService;