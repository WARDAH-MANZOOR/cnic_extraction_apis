-- CreateTable
CREATE TABLE "public"."CnicExtraction" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT,
    "father_name" TEXT,
    "gender" TEXT,
    "country" TEXT,
    "identity_number" TEXT,
    "date_of_birth" TIMESTAMP(3),
    "date_of_issue" TIMESTAMP(3),
    "date_of_expiry" TIMESTAMP(3),
    "present_address_urdu" TEXT,
    "present_address_eng" TEXT,
    "permanent_address_urdu" TEXT,
    "permanent_address_eng" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CnicExtraction_pkey" PRIMARY KEY ("id")
);
