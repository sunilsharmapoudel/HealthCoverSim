function getExtrasTierPrice(tier) {
  const prices = {
    None: 0,
    Basic: 25,
    Standard: 45,
    Premium: 70,
  };
  return prices[tier];
}

function getHospitalTierPrice(tier) {
  const prices = {
    None: 0,
    Basic: 90,
    Bronze: 120,
    Silver: 160,
    Gold: 220,
  };
  return prices[tier];
}

function getAdultCount(coverType) {
  const adultCount = {
    Single: 1,
    Couple: 2,
    Family: 2,
  };
  return adultCount[coverType];
}

// Section 6: LHC loading applies only to hospital cover, only when history
// is 'No' and age > 30. 'Yes' and 'Not sure' never get a loading.
function calculateLhcLoading(age, coverHistory, hospitalCover) {
  if (hospitalCover === 'None') return 0;
  if (coverHistory === 'Yes') return 0;
  if (coverHistory === 'Not sure') return 0;
  if (age > 30) return (age - 30) * 0.02;
  return 0;
}

function round2(value) {
  return Math.round(value * 100) / 100;
}

function calculateQuote(quote) {
  const {
    coverType,
    applicant1,
    applicant2,
    hospitalCover,
    extrasCover,
    paymentFrequency,
    annualDiscount,
  } = quote;

  const adultCount = getAdultCount(coverType);
  const hospitalTierPrice = getHospitalTierPrice(hospitalCover);
  const extrasTierPrice = getExtrasTierPrice(extrasCover);

  const applicants = coverType === 'Single' ? [applicant1] : [applicant1, applicant2];

  const applicantLoadings = [];
  const warnings = [];
  let hospitalTotal = 0;

  applicants.forEach((applicant, i) => {
    const applicantNumber = i + 1;
    const loading = calculateLhcLoading(applicant.age, applicant.coverHistory, hospitalCover);
    applicantLoadings.push({ applicant: applicantNumber, loadingPercent: round2(loading * 100) });
    hospitalTotal += hospitalTierPrice * (1 + loading);
    if (applicant.coverHistory === 'Not sure') {
      warnings.push(
        `Applicant ${applicantNumber}: Cover history is unknown — LHC loading has not been applied. This quote may be inaccurate.`
      );
    }
  });

  const extrasTotal = extrasTierPrice * adultCount;
  const familyFee = coverType === 'Family' ? 30 : 0;
  const monthlyPremium = hospitalTotal + extrasTotal + familyFee;
  const yearlyBeforeDiscount = monthlyPremium * 12;
  const yearlyAfterDiscount =
    paymentFrequency === 'Yearly' ? yearlyBeforeDiscount * (1 - annualDiscount / 100) : null;

  return {
    hospitalPremium: round2(hospitalTotal),
    extrasPremium: round2(extrasTotal),
    familyFee: round2(familyFee),
    monthlyPremium: round2(monthlyPremium),
    yearlyBeforeDiscount: round2(yearlyBeforeDiscount),
    yearlyAfterDiscount: yearlyAfterDiscount === null ? null : round2(yearlyAfterDiscount),
    applicantLoadings,
    warnings,
    lhcStatement:
      'Lifetime Health Cover loading applies only to hospital cover. It does not apply to extras cover.',
  };
}

module.exports = {
  calculateQuote,
  getExtrasTierPrice,
  getHospitalTierPrice,
  getAdultCount,
  calculateLhcLoading,
};
