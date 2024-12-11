"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Initialization
const form = document.getElementById("resumeForm");
const resumePage = document.getElementById("r-page");
const resume_photo = document.getElementById("r-img");
const resume_name1 = document.getElementById("resume-name");
const resume_email = document.getElementById("resume-email");
const resume_phone = document.getElementById("resume-tel");
const resume_education = document.getElementById("resume-edu");
const resume_work_ex = document.getElementById("resume-work");
const resume_skills = document.getElementById("resume-skills");
const editBtn = document.getElementById("edit");
const backBtn = document.getElementById("back");
const shareBtn = document.getElementById("share");
const downloadBtn = document.getElementById("pdf");
const resumeContent = document.getElementById("r-content");
// submit action
form.addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    event.preventDefault();
    // receiving data from form
    const name = document.getElementById("fname").value;
    const email = document.getElementById("eml").value;
    const phone = document.getElementById("num").value;
    const degree = document.getElementById("dgre").value;
    const education = document.getElementById("sch").value;
    const workExperience = document.getElementById("dtls").value;
    const Skills = document.getElementById("skil").value;
    const photoInput = document.getElementById("photo");
    // Photo work
    const photoFile = photoInput.files ? photoInput.files[0] : null;
    let photoBase64 = '';
    if (photoFile) {
        photoBase64 = yield fileToBase64(photoFile);
        localStorage.setItem("r-img", photoBase64);
        resume_photo.src = photoBase64;
    }
    // form to result transition
    (_a = document.querySelector(".container")) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
    resumePage.classList.remove("hidden");
    // compilation of resume info
    resume_name1.textContent = name;
    resume_email.textContent = `Email : ${email}`;
    resume_phone.textContent = `Phone : ${phone}`;
    resume_education.textContent = `${degree} from ${education}`;
    resume_work_ex.textContent = workExperience;
    resume_skills.textContent = Skills;
    // share link button
    const queryParams = new URLSearchParams({
        name: name,
        email: email,
        phone: phone,
        degree: degree,
        edu: education,
        work_ex: workExperience,
        skills: Skills
    });
    const uniqueURL = `${window.location.origin}?${queryParams.toString()}`;
    shareBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(uniqueURL);
        alert("Link has been copied");
    });
    window.history.replaceState(null, '', `${queryParams.toString()}`);
}));
// used to shorten photo url
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
editBtn.addEventListener("click", () => {
    var _a;
    updateFormFromResume();
    (_a = document.querySelector(".container")) === null || _a === void 0 ? void 0 : _a.classList.remove("hidden");
    resumePage.classList.add("hidden");
});
// edit button functionality
function updateFormFromResume() {
    var _a, _b, _c;
    const [degree, education] = ((_a = resume_education.textContent) === null || _a === void 0 ? void 0 : _a.split("from")) || '';
    document.getElementById("fname").value = resume_name1.textContent || '';
    document.getElementById("eml").value = ((_b = resume_email.textContent) === null || _b === void 0 ? void 0 : _b.replace('Email : ', '')) || '';
    document.getElementById("num").value = ((_c = resume_phone.textContent) === null || _c === void 0 ? void 0 : _c.replace('Phone : ', '')) || '';
    document.getElementById("dgre").value = degree || '';
    document.getElementById("sch").value = (education === null || education === void 0 ? void 0 : education.trim()) || '';
    document.getElementById("dtls").value = resume_work_ex.textContent || '';
    document.getElementById("skil").value = resume_skills.textContent || '';
}
// Download button functionality
downloadBtn.addEventListener("click", () => {
    if (typeof html2pdf === 'undefined') {
        alert('Error : html2pdf library not found');
        return;
    }
    const resumeOptions = {
        margin: 0.5,
        filename: 'resume.pdf',
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: "letter", orientation: 'portrait' }
    };
    html2pdf()
        .from(resumeContent)
        .set(resumeOptions)
        .save()
        .catch((error) => {
        console.log('PDF error', error);
    });
});
window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("fname") || '';
    const email = params.get("eml") || '';
    const phone = params.get("num") || '';
    const degree = params.get("dgre") || '';
    const education = params.get("sch") || '';
    const workExperience = params.get("dtls") || '';
    const skills = params.get("skil") || '';
    if (name || email || phone || education || degree || workExperience || skills) {
        resume_name1.textContent = name;
        resume_email.textContent = `Email : ${email}`;
        resume_phone.textContent = `Phone : ${phone}`;
        resume_education.textContent = `${degree} from ${education}`;
        resume_work_ex.textContent = workExperience;
        resume_skills.textContent = skills;
        const savePhoto = localStorage.getItem("resumePhoto");
        if (savePhoto) {
            resume_photo.src = savePhoto;
        }
    }
});
resume_photo.style.width = "150px";
resume_photo.style.height = "150px";
resume_photo.style.objectFit = "cover";
resume_photo.style.borderRadius = "50%";
resume_photo.style.display = "block";
resume_photo.style.margin = "0 auto";
