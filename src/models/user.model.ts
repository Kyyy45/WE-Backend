import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  fullName: string;
  username: string;
  email: string;
  password?: string;
  role: "admin" | "teacher" | "student";
  isVerified: boolean;
  isDeactivated?: boolean;

  avatarUrl?: string;
  avatarPublicId?: string;

  // Tambahan untuk sistem rekomendasi
  age?: number;
  educationLevel?: string; // contoh: "SD", "SMP", "SMA", "Mahasiswa"
  interests?: string[]; // contoh: ["Bahasa", "Teknologi", "Sains"]

  // Token dan keamanan
  activationToken?: string;
  activationExpires?: Date;
  refreshToken?: string;
  refreshTokenExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;

  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    role: {
      type: String,
      enum: ["admin", "teacher", "student"],
      default: "student",
    },
    isVerified: { type: Boolean, default: false },
    isDeactivated: { type: Boolean, default: false },
    avatarUrl: { type: String },
    avatarPublicId: { type: String },

    // ✨ field baru untuk rekomendasi
    age: { type: Number },
    educationLevel: { type: String },
    interests: [{ type: String }],

    activationToken: String,
    activationExpires: Date,
    refreshToken: String,
    refreshTokenExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

// Hash password sebelum save
UserSchema.pre("save", async function (next) {
  const user = this as IUser;
  if (!user.isModified("password") || !user.password) return next();

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (
  candidate: string
): Promise<boolean> {
  return bcrypt.compare(candidate, this.password!);
};

export default mongoose.model<IUser>("User", UserSchema);
