export const validationRules = {
    email: {
        validate: (value) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) return 'Email is required';
            if (!emailRegex.test(value)) return 'Please enter a valid email address';
            if (value.length > 100) return 'Email must be less than 100 characters';
            return '';
        }
    },

    phone: {
        validate: (value) => {
            if (!value) return 'Phone number is required';
            // Remove any non-digit characters for validation
            const cleanPhone = value.replace(/\D/g, '');
            if (cleanPhone.length < 8) return 'Phone number is too short';
            if (cleanPhone.length > 15) return 'Phone number is too long';
            return '';
        }
    },

    password: {
        validate: (value) => {
            if (!value) return 'Password is required';
            if (value.length < 8) return 'Password must be at least 8 characters';
            if (value.length > 24) return 'Password must be less than 24 characters';
            if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter';
            if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter';
            if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number';
            if (!/(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(value)) return 'Password must contain at least one special character';
            if (/\s/.test(value)) return 'Password cannot contain spaces';
            return '';
        }
    },

    confirmPassword: {
        validate: (value, formData) => {
            if (!value) return 'Please confirm your password';
            if (value !== formData.password) return 'Passwords do not match';
            return '';
        }
    },

    otp: {
        validate: (value) => {
            if (!value) return 'OTP is required';
            if (!/^\d+$/.test(value)) return 'OTP must contain only numbers';
            if (value.length !== 6) return 'OTP must be exactly 6 digits';
            return '';
        }
    },

    terms: {
        validate: (value) => {
            if (!value) return 'You must agree to the terms and conditions';
            return '';
        }
    }
};

export const validateField = (name, value, formData = {}) => {
    if (validationRules[name]) {
        return validationRules[name].validate(value, formData);
    }
    return '';
};

export const validateForm = (formData, fieldsToValidate) => {
    const errors = {};
    let isValid = true;

    fieldsToValidate.forEach(field => {
        const error = validateField(field, formData[field], formData);
        if (error) {
            errors[field] = error;
            isValid = false;
        }
    });

    return { isValid, errors };
};