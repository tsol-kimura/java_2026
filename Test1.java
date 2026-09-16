public class Test1 {
    public static void main(String[] args) {
        runVerification();
    }

    public static void runVerification() {
        String[][] testCases = {
                { "09:00:00", "14:59:00", "5時間59分 (休憩なし)" },
                { "09:00:00", "15:00:00", "6時間00分 (休憩なし)" },
                { "09:00:00", "15:01:00", "6時間01分 (45分休憩開始)" },
                { "09:00:00", "16:59:00", "7時間59分 (45分休憩)" },
                { "09:00:00", "17:00:00", "8時間00分 (45分休憩)" },
                { "09:00:00", "17:01:00", "8時間01分 (60分休憩開始)" },
                { "09:00:00", "17:59:00", "8時間59分 (60分休憩開始)" },
                { "09:00:00", "18:00:00", "9時間00分 (60分休憩)" },
                { "09:00:00", "18:01:00", "9時間01分 (60分休憩 + 残業)" },
                { "09:00:00", "18:59:00", "9時間59分 (60分休憩 + 残業)" },
                { "09:00:00", "19:00:00", "10時間00分 (60分休憩 + 残業)" },
                { "09:00:00", "19:01:00", "10時間01分 (60分休憩 + 残業)" }
        };

        System.out.println("=== WorkTimeCalculator Verification ===");
        WorkTimeCalculator calc = new WorkTimeCalculator();
        for (String[] testCase : testCases) {
            String start = testCase[0];
            String end = testCase[1];
            String label = testCase[2];

            System.out.println();
            System.out.println("ケース: " + label);
            System.out.println("入力: " + start + " 〜 " + end);

            try {
                calc.calculate(start, end);
            } catch (IllegalArgumentException e) {
                System.out.println("エラー: " + e.getMessage());
            }
        }
    }
}
