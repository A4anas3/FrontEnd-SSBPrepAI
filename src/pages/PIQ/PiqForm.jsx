import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPiqForm, savePiqForm } from "@/features/piq/apiPiq";
import { useToast } from "@/components/ui/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import Header from "@/components/Header";
import { Printer, Save } from "lucide-react";

const PiqForm = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: piqData, isLoading } = useQuery({
        queryKey: ["piq"],
        queryFn: getPiqForm,
    });

    const [formData, setFormData] = useState({
        fullName: "",
        fathersName: "",
        placeOfResidence: "",
        presentAddress: "",
        presentAddressPopulation: "",
        permanentAddress: "",
        permanentAddressPopulation: "",
        stateDistrict: "",
        religion: "",
        category: "",
        motherTongue: "",
        dateOfBirth: "",
        parentsAlive: "Yes",
        ageAtParentsDeath: "",
        familyDetails: [
            { relation: "Father", education: "", occupation: "", incomePerMonth: "" },
            { relation: "Mother", education: "", occupation: "", incomePerMonth: "" },
            { relation: "Guardian", education: "", occupation: "", incomePerMonth: "" },
        ],
        educationDetails: [
            { exam: "Matric/Hr Sec", year: "", divisionMarks: "", medium: "", boarderDayScholar: "" },
            { exam: "10+2 Equivalent", year: "", divisionMarks: "", medium: "", boarderDayScholar: "" },
            { exam: "BA/B.Sc./B.Com./BE", year: "", divisionMarks: "", medium: "", boarderDayScholar: "" },
            { exam: "Professional", year: "", divisionMarks: "", medium: "", boarderDayScholar: "" },
        ],
        numberOfBrothers: "",
        numberOfSisters: "",
        yourNumberInSiblings: "",
        ageYearsMonths: "",
        height: "",
        weight: "",
        presentOccupation: "",
        personalIncome: "",
        nccTraining: "No",
        nccTotalTraining: "",
        nccWing: "",
        nccDivision: "",
        nccCertificate: "",
        gamesAndSports: "",
        hobbiesInterests: "",
        extraCurricular: "",
        positionOfResponsibility: "",
    });

    // Populate form when data loads (preserve default arrays if API returns null)
    useEffect(() => {
        if (piqData) {
            setFormData((prev) => {
                // Merge API data, replacing any null/undefined with empty string
                const merged = { ...prev };
                for (const key of Object.keys(prev)) {
                    if (key === "familyDetails") {
                        merged.familyDetails = piqData.familyDetails || prev.familyDetails;
                    } else if (key === "educationDetails") {
                        merged.educationDetails = piqData.educationDetails || prev.educationDetails;
                    } else {
                        merged[key] = piqData[key] ?? prev[key] ?? "";
                    }
                }
                return merged;
            });
        }
    }, [piqData]);

    const mutation = useMutation({
        mutationFn: savePiqForm,
        onSuccess: () => {
            toast({
                title: "Success",
                description: "PIQ Form saved successfully.",
                className: "bg-green-600 text-white border-green-700",
            });
            queryClient.invalidateQueries(["piq"]);
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to save PIQ Form.",
                variant: "destructive",
            });
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFamilyChange = (index, field, value) => {
        const updated = [...formData.familyDetails];
        updated[index][field] = value;
        setFormData((prev) => ({ ...prev, familyDetails: updated }));
    };

    const handleEducationChange = (index, field, value) => {
        const updated = [...formData.educationDetails];
        updated[index][field] = value;
        setFormData((prev) => ({ ...prev, educationDetails: updated }));
    };

    const handlePrint = () => {
        window.print();
    };

    if (isLoading) return <LoadingSpinner />;

    // Shared input class
    const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent print:border-none print:ring-0 print:p-0 print:rounded-none";
    const labelCls = "block text-sm font-semibold text-gray-700 mb-1";

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="print:hidden">
                <Header />
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-10">
                {/* 🖨️ ACTION BUTTONS */}
                <div className="flex justify-end gap-3 mb-6 print:hidden">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-sm"
                    >
                        <Printer size={18} /> Print
                    </button>
                    <button
                        onClick={() => mutation.mutate(formData)}
                        disabled={mutation.isPending}
                        className="flex items-center gap-2 px-5 py-2.5 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 text-sm"
                    >
                        <Save size={18} /> {mutation.isPending ? "Saving..." : "Save & Edit"}
                    </button>
                </div>

                {/* 📄 FORM */}
                <div className="bg-white rounded-2xl shadow-sm border p-4 sm:p-8 print:shadow-none print:border-none print:p-2">
                    <h1 className="text-center font-bold text-lg sm:text-xl mb-6 text-gray-800">
                        PERSONAL INFORMATION QUESTIONNAIRE (PIQ)
                    </h1>

                    <div className="space-y-5">

                        {/* 1. Name */}
                        <div>
                            <label className={labelCls}>1. Name (in capital letters)</label>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                                className={`${inputCls} uppercase`} placeholder="Enter Name" />
                        </div>

                        {/* 2. Father's Name */}
                        <div>
                            <label className={labelCls}>2. Father's Name</label>
                            <input type="text" name="fathersName" value={formData.fathersName} onChange={handleChange}
                                className={inputCls} />
                        </div>

                        {/* 3. Place of Residence */}
                        <div>
                            <label className={labelCls}>3. Place of maximum residence</label>
                            <input type="text" name="placeOfResidence" value={formData.placeOfResidence} onChange={handleChange}
                                className={inputCls} />
                        </div>

                        {/* 4. Present Address */}
                        <div>
                            <label className={labelCls}>4. Present Address (with approx population)</label>
                            <textarea name="presentAddress" value={formData.presentAddress} onChange={handleChange}
                                rows={2} className={`${inputCls} resize-none`} />
                        </div>

                        {/* 5. Permanent Address */}
                        <div>
                            <label className={labelCls}>5. Permanent Address (with approx population)</label>
                            <textarea name="permanentAddress" value={formData.permanentAddress} onChange={handleChange}
                                rows={2} className={`${inputCls} resize-none`} />
                        </div>

                        {/* 6. Basic Details — responsive grid */}
                        <div>
                            <label className={labelCls}>6. Basic Details</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                                <div>
                                    <label className="text-xs text-gray-500">State & District</label>
                                    <input name="stateDistrict" value={formData.stateDistrict} onChange={handleChange} className={inputCls} />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Religion</label>
                                    <input name="religion" value={formData.religion} onChange={handleChange} className={inputCls} />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Category</label>
                                    <select name="category" value={formData.category} onChange={handleChange} className={inputCls}>
                                        <option value="">Select Category</option>
                                        <option value="General">General</option>
                                        <option value="SC">SC</option>
                                        <option value="ST">ST</option>
                                        <option value="OBC">OBC</option>
                                        <option value="EWS">EWS</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Mother Tongue</label>
                                    <input name="motherTongue" value={formData.motherTongue} onChange={handleChange} className={inputCls} />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Date of Birth</label>
                                    <input name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className={inputCls} />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Parents Alive</label>
                                    <input name="parentsAlive" value={formData.parentsAlive} onChange={handleChange} className={inputCls} />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="text-xs text-gray-500">If not, age at parent's death</label>
                                    <input name="ageAtParentsDeath" value={formData.ageAtParentsDeath} onChange={handleChange} className={inputCls} />
                                </div>
                            </div>
                        </div>

                        {/* 7. Family Occupation — card-based on mobile, table on desktop */}
                        <div>
                            <label className={labelCls}>7. Parents'/Guardians' Occupation & Income</label>

                            {/* Desktop table */}
                            <div className="hidden sm:block mt-2">
                                <table className="w-full border border-gray-200 text-sm text-center rounded-lg overflow-hidden">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="border-r border-gray-200 p-2 font-semibold">Particulars</th>
                                            <th className="border-r border-gray-200 p-2 font-semibold">Education</th>
                                            <th className="border-r border-gray-200 p-2 font-semibold">Occupation</th>
                                            <th className="p-2 font-semibold">Income/month</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formData.familyDetails.map((item, index) => (
                                            <tr key={index} className="border-t border-gray-200">
                                                <td className="border-r border-gray-200 p-2 font-medium">{item.relation}</td>
                                                <td className="border-r border-gray-200 p-0">
                                                    <input value={item.education} onChange={(e) => handleFamilyChange(index, "education", e.target.value)}
                                                        className="w-full h-full text-center outline-none py-2 px-1" />
                                                </td>
                                                <td className="border-r border-gray-200 p-0">
                                                    <input value={item.occupation} onChange={(e) => handleFamilyChange(index, "occupation", e.target.value)}
                                                        className="w-full h-full text-center outline-none py-2 px-1" />
                                                </td>
                                                <td className="p-0">
                                                    <input type="number" value={item.incomePerMonth} onChange={(e) => handleFamilyChange(index, "incomePerMonth", e.target.value)}
                                                        className="w-full h-full text-center outline-none py-2 px-1" placeholder="₹" />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile cards */}
                            <div className="sm:hidden mt-2 space-y-3">
                                {formData.familyDetails.map((item, index) => (
                                    <div key={index} className="border border-gray-200 rounded-xl p-3 space-y-2">
                                        <p className="font-semibold text-sm text-gray-700">{item.relation}</p>
                                        <input placeholder="Education" value={item.education}
                                            onChange={(e) => handleFamilyChange(index, "education", e.target.value)}
                                            className={inputCls} />
                                        <input placeholder="Occupation" value={item.occupation}
                                            onChange={(e) => handleFamilyChange(index, "occupation", e.target.value)}
                                            className={inputCls} />
                                        <input type="number" placeholder="Income/month (₹)" value={item.incomePerMonth}
                                            onChange={(e) => handleFamilyChange(index, "incomePerMonth", e.target.value)}
                                            className={inputCls} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 8. Educational Record — card-based on mobile, table on desktop */}
                        <div>
                            <label className={labelCls}>8. Educational Record</label>

                            {/* Desktop table */}
                            <div className="hidden sm:block mt-2">
                                <table className="w-full border border-gray-200 text-sm text-center rounded-lg overflow-hidden">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="border-r border-gray-200 p-2 font-semibold">Exam</th>
                                            <th className="border-r border-gray-200 p-2 font-semibold">Year</th>
                                            <th className="border-r border-gray-200 p-2 font-semibold">Div & Marks</th>
                                            <th className="border-r border-gray-200 p-2 font-semibold">Medium</th>
                                            <th className="p-2 font-semibold">Boarder/Day</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formData.educationDetails.map((item, index) => (
                                            <tr key={index} className="border-t border-gray-200">
                                                <td className="border-r border-gray-200 p-2 font-medium text-left text-xs">{item.exam}</td>
                                                <td className="border-r border-gray-200 p-0">
                                                    <input value={item.year} onChange={(e) => handleEducationChange(index, "year", e.target.value)}
                                                        className="w-full text-center outline-none py-2 px-1" />
                                                </td>
                                                <td className="border-r border-gray-200 p-0">
                                                    <input value={item.divisionMarks} onChange={(e) => handleEducationChange(index, "divisionMarks", e.target.value)}
                                                        className="w-full text-center outline-none py-2 px-1" />
                                                </td>
                                                <td className="border-r border-gray-200 p-0">
                                                    <input value={item.medium} onChange={(e) => handleEducationChange(index, "medium", e.target.value)}
                                                        className="w-full text-center outline-none py-2 px-1" />
                                                </td>
                                                <td className="p-0">
                                                    <input value={item.boarderDayScholar} onChange={(e) => handleEducationChange(index, "boarderDayScholar", e.target.value)}
                                                        className="w-full text-center outline-none py-2 px-1" />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile cards */}
                            <div className="sm:hidden mt-2 space-y-3">
                                {formData.educationDetails.map((item, index) => (
                                    <div key={index} className="border border-gray-200 rounded-xl p-3 space-y-2">
                                        <p className="font-semibold text-sm text-gray-700">{item.exam}</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            <input placeholder="Year" value={item.year}
                                                onChange={(e) => handleEducationChange(index, "year", e.target.value)}
                                                className={inputCls} />
                                            <input placeholder="Div & Marks" value={item.divisionMarks}
                                                onChange={(e) => handleEducationChange(index, "divisionMarks", e.target.value)}
                                                className={inputCls} />
                                            <input placeholder="Medium" value={item.medium}
                                                onChange={(e) => handleEducationChange(index, "medium", e.target.value)}
                                                className={inputCls} />
                                            <input placeholder="Boarder/Day" value={item.boarderDayScholar}
                                                onChange={(e) => handleEducationChange(index, "boarderDayScholar", e.target.value)}
                                                className={inputCls} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 9 & 10: Siblings + Physical Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className={labelCls}>9. Siblings</label>
                                <div className="space-y-2 mt-1">
                                    <div>
                                        <label className="text-xs text-gray-500">No. of Brothers</label>
                                        <input name="numberOfBrothers" value={formData.numberOfBrothers} onChange={handleChange} className={inputCls} />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500">No. of Sisters</label>
                                        <input name="numberOfSisters" value={formData.numberOfSisters} onChange={handleChange} className={inputCls} />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500">Your Number in Siblings</label>
                                        <input name="yourNumberInSiblings" value={formData.yourNumberInSiblings} onChange={handleChange} className={inputCls} />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className={labelCls}>10. Physical Stats</label>
                                <div className="space-y-2 mt-1">
                                    <div>
                                        <label className="text-xs text-gray-500">Age (Yrs + Mths)</label>
                                        <input name="ageYearsMonths" value={formData.ageYearsMonths} onChange={handleChange} className={inputCls} />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500">Height (m)</label>
                                        <input name="height" value={formData.height} onChange={handleChange} className={inputCls} />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500">Weight (kg)</label>
                                        <input name="weight" value={formData.weight} onChange={handleChange} className={inputCls} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 11. Occupation */}
                        <div>
                            <label className={labelCls}>11. Present Occupation & Income</label>
                            <textarea name="presentOccupation" value={formData.presentOccupation} onChange={handleChange}
                                rows={2} className={`${inputCls} resize-none`} />
                        </div>

                        {/* 12. NCC */}
                        <div>
                            <label className={labelCls}>12. NCC Training</label>
                            <div className="mt-2 space-y-3">
                                <div className="flex items-center gap-4">
                                    <span className="text-sm">Training:</span>
                                    <label className="flex items-center gap-1 text-sm">
                                        <input type="radio" name="nccTraining" value="Yes" checked={formData.nccTraining === "Yes"} onChange={handleChange} /> Yes
                                    </label>
                                    <label className="flex items-center gap-1 text-sm">
                                        <input type="radio" name="nccTraining" value="No" checked={formData.nccTraining === "No"} onChange={handleChange} /> No
                                    </label>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-gray-500">Total Training</label>
                                        <input name="nccTotalTraining" value={formData.nccTotalTraining} onChange={handleChange} className={inputCls} />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500">Wing</label>
                                        <input name="nccWing" value={formData.nccWing} onChange={handleChange} className={inputCls} />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500">Division</label>
                                        <input name="nccDivision" value={formData.nccDivision} onChange={handleChange} className={inputCls} />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500">Certificate</label>
                                        <input name="nccCertificate" value={formData.nccCertificate} onChange={handleChange} className={inputCls} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 13. Activities */}
                        <div>
                            <label className={labelCls}>13. Extra-curricular Activities</label>
                            <div className="space-y-3 mt-2">
                                <div>
                                    <label className="text-xs text-gray-500">Games & Sports</label>
                                    <textarea name="gamesAndSports" value={formData.gamesAndSports} onChange={handleChange}
                                        rows={2} className={`${inputCls} resize-none`} />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Hobbies / Interests</label>
                                    <textarea name="hobbiesInterests" value={formData.hobbiesInterests} onChange={handleChange}
                                        rows={2} className={`${inputCls} resize-none`} />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Extra-curricular Activities</label>
                                    <textarea name="extraCurricular" value={formData.extraCurricular} onChange={handleChange}
                                        rows={2} className={`${inputCls} resize-none`} />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Position of Responsibility</label>
                                    <textarea name="positionOfResponsibility" value={formData.positionOfResponsibility} onChange={handleChange}
                                        rows={2} className={`${inputCls} resize-none`} />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Bottom save button (mobile-friendly) */}
                <div className="mt-6 print:hidden">
                    <button
                        onClick={() => mutation.mutate(formData)}
                        disabled={mutation.isPending}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-yellow-500 text-black font-semibold rounded-xl hover:bg-yellow-400 text-sm mx-auto"
                    >
                        <Save size={18} /> {mutation.isPending ? "Saving..." : "Save & Edit"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PiqForm;
