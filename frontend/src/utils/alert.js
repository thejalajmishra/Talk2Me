import Swal from 'sweetalert2';

export const showAlert = (type, message) => {
    Swal.fire({
        icon: type,
        title: message,
        confirmButtonColor: '#6366F1', // indigo-500
    });
};
