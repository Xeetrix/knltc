import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      entityType = "LEAD",
      name = "Candidate",
      program = "Language Program",
      status = "NEW_LEAD",
      sscGpa = "",
      hscGpa = "",
      education = "",
      japaneseProficiency = "",
      studyGapYears = 0,
      uploadedDocsCount = 0,
      totalDocsCount = 12,
      latestNote = "",
      city = "Dhaka",
      language = "en",
      extraContext = "",
    } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback intelligent counselor summary if GEMINI_API_KEY is not configured
      const gpaText =
        sscGpa || hscGpa
          ? `with an HSC GPA of ${hscGpa || "N/A"} and an SSC GPA of ${sscGpa || "N/A"}`
          : `with ${education || "standard academic qualification"}`;
      const docText =
        uploadedDocsCount > 0
          ? `has submitted ${uploadedDocsCount} of ${totalDocsCount} required documents`
          : `has not yet submitted any formal application documents`;
      const noteText = latestNote
        ? `In the recent counselor note: "${latestNote}".`
        : `No specific concerns or objections were recorded in recent calls.`;
      const nextStep =
        status === "NEW_LEAD"
          ? "conduct the initial eligibility call, verify SSC/HSC transcripts, and share the Japan program roadmap."
          : status === "CONTACTED" || status === "COUNSELED"
            ? "guide the candidate on required COE documents and book an in-person or Zoom counseling session."
            : status === "VISIT_BOOKED"
              ? "complete the office assessment, confirm partner school selection, and initiate file opening."
              : "proceed with COE documentation verification and Japanese language batch attendance tracking.";

      const fallbackSummary =
        language === "bn"
          ? `${name} (${city}) জাপানের ${program} প্রোগ্রামে আগ্রহী (${gpaText})। প্রার্থী এখনও পর্যন্ত ${uploadedDocsCount}/${totalDocsCount}টি ডকুমেন্ট জমা দিয়েছেন। ${latestNote ? `সর্বশেষ নোট: "${latestNote}"।` : ""} কাউন্সেলরের জন্য পরবর্তী সর্বোত্তম পদক্ষেপ হলো প্রার্থীকে প্রয়োজনীয় ডকুমেন্ট ও পরবর্তী ধাপ সম্পর্কে গাইড করা।`
          : `${name} has an academic profile ${gpaText} and is interested in ${program} in Japan, and ${docText}. ${noteText} The most useful next action for the counselor would be to ${nextStep}`;

      return NextResponse.json({ summary: fallbackSummary, source: "auto" });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const prompt =
      entityType === "LEAD"
        ? `Write a concise, 3-sentence executive counselor profile summary for a student applying to Japan through KNLTC.
Student Name: ${name}
City: ${city}
Target Program: ${program}
Current Status: ${status}
Education: ${education}, SSC GPA: ${sscGpa || "Not entered"}, HSC GPA: ${hscGpa || "Not entered"}, Study Gap: ${studyGapYears} years
Japanese Level: ${japaneseProficiency}
Documents Uploaded: ${uploadedDocsCount} out of ${totalDocsCount}
Recent Call/Counselor Note: ${latestNote || "None yet"}
Additional Context: ${extraContext}

Style: Write in a natural, professional third-person paragraph (no bullet points, no markdown bolding) just like: "${name} has a strong academic profile with a high school GPA of ... He/She is interested in ... in Japan ... In his/her recent chat/call ... The most useful next action for the counselor would be to ...".
Language: ${language === "bn" ? "Bengali (বাংলা)" : language === "ja" ? "Japanese (日本語)" : "English"}.`
        : `Write a concise, 3-sentence executive summary for a ${entityType === "SCHOOL" ? "Japanese Partner Institution" : "B2B Referral Agency"} working with KNLTC.
Name: ${name}
Location: ${city}
Program/Type: ${program}
Status: ${status}
Details: ${extraContext}
Recent Note: ${latestNote || "Active partnership"}
Style: Natural, professional 3-sentence paragraph (no bullet points, no markdown) highlighting partnership strength, student pipeline status, and recommended next coordination step.
Language: ${language === "bn" ? "Bengali (বাংলা)" : language === "ja" ? "Japanese (日本語)" : "English"}.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    const generatedText = (response.text || "").trim();
    return NextResponse.json({
      summary: generatedText,
      source: "gemini",
    });
  } catch (err) {
    console.error("Error generating AI profile summary:", err);
    return NextResponse.json(
      { error: "Failed to generate AI summary" },
      { status: 500 }
    );
  }
}
