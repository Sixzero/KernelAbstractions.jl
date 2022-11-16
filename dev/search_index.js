var documenterSearchIndex = {"docs":
[{"location":"examples/memcopy_static/#Memcopy-with-static-NDRange-1","page":"Memcopy with static NDRange","title":"Memcopy with static NDRange","text":"","category":"section"},{"location":"examples/memcopy_static/#","page":"Memcopy with static NDRange","title":"Memcopy with static NDRange","text":"The first example simple copies memory from A to B. In contrast to the previous examples it uses a fully static kernel configuration. Specializing the kernel on the iteration range itself.","category":"page"},{"location":"examples/memcopy_static/#","page":"Memcopy with static NDRange","title":"Memcopy with static NDRange","text":"using Markdown\nusing KernelAbstractions\npath = joinpath(dirname(pathof(KernelAbstractions)), \"..\", \"examples/memcopy_static.jl\")\nMarkdown.parse(\"\"\"\n```julia\n$(read(path, String))\n```\n\"\"\")","category":"page"},{"location":"examples/memcopy/#Memcopy-1","page":"Memcopy","title":"Memcopy","text":"","category":"section"},{"location":"examples/memcopy/#","page":"Memcopy","title":"Memcopy","text":"The first example simple copies memory from A to B","category":"page"},{"location":"examples/memcopy/#","page":"Memcopy","title":"Memcopy","text":"using Markdown\nusing KernelAbstractions\npath = joinpath(dirname(pathof(KernelAbstractions)), \"..\", \"examples/memcopy.jl\")\nMarkdown.parse(\"\"\"\n```julia\n$(read(path, String))\n```\n\"\"\")","category":"page"},{"location":"kernels/#Writing-kernels-1","page":"Writing kernels","title":"Writing kernels","text":"","category":"section"},{"location":"kernels/#","page":"Writing kernels","title":"Writing kernels","text":"These kernel language constructs are intended to be used as part of @kernel functions and not valid outside that context.","category":"page"},{"location":"kernels/#Constant-arguments-1","page":"Writing kernels","title":"Constant arguments","text":"","category":"section"},{"location":"kernels/#","page":"Writing kernels","title":"Writing kernels","text":"Kernel functions allow for input arguments to be marked with the @Const macro. It informs the compiler that the memory accessed through that marked input argument, will not be written to as part of the kernel. This has the implication that input arguments are not allowed to alias each other. If you are used to CUDA C this is similar to const restrict.","category":"page"},{"location":"kernels/#Indexing-1","page":"Writing kernels","title":"Indexing","text":"","category":"section"},{"location":"kernels/#","page":"Writing kernels","title":"Writing kernels","text":"There are several @index variants.","category":"page"},{"location":"kernels/#Local-memory,-variable-lifetime-and-private-memory-1","page":"Writing kernels","title":"Local memory, variable lifetime and private memory","text":"","category":"section"},{"location":"kernels/#","page":"Writing kernels","title":"Writing kernels","text":"@localmem, @synchronize, @private","category":"page"},{"location":"kernels/#Launching-kernels-1","page":"Writing kernels","title":"Launching kernels","text":"","category":"section"},{"location":"kernels/#dependencies-1","page":"Writing kernels","title":"Kernel dependencies","text":"","category":"section"},{"location":"api/#API-1","page":"API","title":"API","text":"","category":"section"},{"location":"api/#api_kernel_language-1","page":"API","title":"Kernel language","text":"","category":"section"},{"location":"api/#","page":"API","title":"API","text":"@kernel\n@Const\n@index\n@localmem\n@private\n@synchronize\n@print\n@uniform\n@groupsize\n@ndrange","category":"page"},{"location":"api/#KernelAbstractions.@kernel","page":"API","title":"KernelAbstractions.@kernel","text":"@kernel function f(args) end\n\nTakes a function definition and generates a Kernel constructor from it. The enclosed function is allowed to contain kernel language constructs. In order to call it the kernel has first to be specialized on the backend and then invoked on the arguments.\n\nKernel language\n\n@Const\n@index\n@groupsize\n@ndrange\n@localmem\n@private\n@uniform\n@synchronize\n@print\n\nExample:\n\n@kernel function vecadd(A, @Const(B))\n    I = @index(Global)\n    @inbounds A[I] += B[I]\nend\n\nA = ones(1024)\nB = rand(1024)\nevent = vecadd(CPU(), 64)(A, B, ndrange=size(A))\nwait(event)\n\n\n\n\n\n","category":"macro"},{"location":"api/#KernelAbstractions.@Const","page":"API","title":"KernelAbstractions.@Const","text":"@Const(A)\n\n@Const is an argument annotiation that asserts that the memory reference by A is both not written to as part of the kernel and that it does not alias any other memory in the kernel.\n\ndanger: Danger\nViolating those constraints will lead to arbitrary behaviour.\n\nas an example given a kernel signature kernel(A, @Const(B)), you are not allowed to call the kernel with kernel(A, A) or kernel(A, view(A, :)).\n\n\n\n\n\n","category":"macro"},{"location":"api/#KernelAbstractions.@index","page":"API","title":"KernelAbstractions.@index","text":"@index\n\nThe @index macro can be used to give you the index of a workitem within a kernel function. It supports both the production of a linear index or a cartesian index. A cartesian index is a general N-dimensional index that is derived from the iteration space.\n\nIndex granularity\n\nGlobal: Used to access global memory.\nGroup: The index of the workgroup.\nLocal: The within workgroup index.\n\nIndex kind\n\nLinear: Produces an Int64 that can be used to linearly index into memory.\nCartesian: Produces a CartesianIndex{N} that can be used to index into memory.\nNTuple: Produces a NTuple{N} that can be used to index into memory.\n\nIf the index kind is not provided it defaults to Linear, this is subject to change.\n\nExamples\n\n@index(Global, Linear)\n@index(Global, Cartesian)\n@index(Local, Cartesian)\n@index(Group, Linear)\n@index(Local, NTuple)\n@index(Global)\n\n\n\n\n\n","category":"macro"},{"location":"api/#KernelAbstractions.@localmem","page":"API","title":"KernelAbstractions.@localmem","text":"@localmem T dims\n\nDeclare storage that is local to a workgroup.\n\n\n\n\n\n","category":"macro"},{"location":"api/#KernelAbstractions.@private","page":"API","title":"KernelAbstractions.@private","text":"@private T dims\n\nDeclare storage that is local to each item in the workgroup. This can be safely used across @synchronize statements. On a CPU, this will allocate additional implicit dimensions to ensure correct localization.\n\nFor storage that only persists between @synchronize statements, an MArray can be used instead.\n\nSee also @uniform.\n\n\n\n\n\n@private mem = 1\n\nCreates a private local of mem per item in the workgroup. This can be safely used across @synchronize statements.\n\n\n\n\n\n","category":"macro"},{"location":"api/#KernelAbstractions.@synchronize","page":"API","title":"KernelAbstractions.@synchronize","text":"@synchronize()\n\nAfter a @synchronize statement all read and writes to global and local memory from each thread in the workgroup are visible in from all other threads in the workgroup.\n\n\n\n\n\n@synchronize(cond)\n\nAfter a @synchronize statement all read and writes to global and local memory from each thread in the workgroup are visible in from all other threads in the workgroup. cond is not allowed to have any visible sideffects.\n\nPlatform differences\n\nGPU: This synchronization will only occur if the cond evaluates.\nCPU: This synchronization will always occur.\n\n\n\n\n\n","category":"macro"},{"location":"api/#KernelAbstractions.@print","page":"API","title":"KernelAbstractions.@print","text":"@print(items...)\n\nThis is a unified print statement.\n\nPlatform differences\n\nGPU: This will reorganize the items to print via @cuprintf\nCPU: This will call print(items...)\n\n\n\n\n\n","category":"macro"},{"location":"api/#KernelAbstractions.@uniform","page":"API","title":"KernelAbstractions.@uniform","text":"@uniform expr\n\nexpr is evaluated outside the workitem scope. This is useful for variable declarations that span workitems, or are reused across @synchronize statements.\n\n\n\n\n\n","category":"macro"},{"location":"api/#KernelAbstractions.@groupsize","page":"API","title":"KernelAbstractions.@groupsize","text":"@groupsize()\n\nQuery the workgroupsize on the device. This function returns a tuple corresponding to kernel configuration. In order to get the total size you can use prod(@groupsize()).\n\n\n\n\n\n","category":"macro"},{"location":"api/#KernelAbstractions.@ndrange","page":"API","title":"KernelAbstractions.@ndrange","text":"@ndrange()\n\nQuery the ndrange on the device. This function returns a tuple corresponding to kernel configuration.\n\n\n\n\n\n","category":"macro"},{"location":"api/#Host-interface-1","page":"API","title":"Host interface","text":"","category":"section"},{"location":"api/#Internal-1","page":"API","title":"Internal","text":"","category":"section"},{"location":"api/#","page":"API","title":"API","text":"KernelAbstractions.Kernel\nKernelAbstractions.partition","category":"page"},{"location":"api/#KernelAbstractions.Kernel","page":"API","title":"KernelAbstractions.Kernel","text":"Kernel{Device, WorkgroupSize, NDRange, Func}\n\nKernel closure struct that is used to represent the device kernel on the host. WorkgroupSize is the number of workitems in a workgroup.\n\n\n\n\n\n","category":"type"},{"location":"extras/unrolling/#Unroll-macro-1","page":"Unroll macro","title":"Unroll macro","text":"","category":"section"},{"location":"extras/unrolling/#","page":"Unroll macro","title":"Unroll macro","text":"CurrentModule = KernelAbstractions.Extras","category":"page"},{"location":"extras/unrolling/#","page":"Unroll macro","title":"Unroll macro","text":"@unroll","category":"page"},{"location":"extras/unrolling/#KernelAbstractions.Extras.LoopInfo.@unroll","page":"Unroll macro","title":"KernelAbstractions.Extras.LoopInfo.@unroll","text":"@unroll expr\n\nTakes a for loop as expr and informs the LLVM unroller to fully unroll it, if it is safe to do so and the loop count is known.\n\n\n\n\n\n@unroll N expr\n\nTakes a for loop as expr and informs the LLVM unroller to unroll it N times, if it is safe to do so.\n\n\n\n\n\n","category":"macro"},{"location":"design/#Design-notes-1","page":"Design notes","title":"Design notes","text":"","category":"section"},{"location":"design/#","page":"Design notes","title":"Design notes","text":"Loops are affine\nOperation over workgroups/blocks\nGoal: Kernel fusion\n@Const:\nrestrict const in C\nldg on the GPU\n@aliasscopes on the CPU\nCartesian or Linear indicies supported\n`@index(Linear)\n`@index(Cartesian)\n@synchronize for inserting workgroup-level synchronization\nworkgroupsize constant\nmay allow for Dynamic()\nterminology – how much to borrow from OpenCL\nhttp://portablecl.org/docs/html/kernel_compiler.html#work-group-function-generation","category":"page"},{"location":"design/#TODO-1","page":"Design notes","title":"TODO","text":"","category":"section"},{"location":"design/#","page":"Design notes","title":"Design notes","text":"Do we want to support Cartesian indices?\nJust got removed from GPUArrays\nrecovery is costly\nGoing from Cartesian to linear sometimes confuses LLVM (IIRC this is true for dynamic strides, due to overflow issues)\n@index(Global, Linear)\nSupport non-multiple of workgroupsize\ndo we require index inbounds checks?\nHarmful for CPU vectorization – likely want to generate two kernels\nMultithreading requires 1.3\nTests\nDocs\nExamples\nIndex calculations\ninbounds checks on the GPU\n","category":"page"},{"location":"examples/naive_transpose/#Naive-Transpose-1","page":"Naive Transpose","title":"Naive Transpose","text":"","category":"section"},{"location":"examples/naive_transpose/#","page":"Naive Transpose","title":"Naive Transpose","text":"using Markdown\nusing KernelAbstractions\npath = joinpath(dirname(pathof(KernelAbstractions)), \"..\", \"examples/naive_transpose.jl\")\nMarkdown.parse(\"\"\"\n```julia\n$(read(path, String))\n```\n\"\"\")","category":"page"},{"location":"quickstart/#Quickstart-1","page":"Quickstart","title":"Quickstart","text":"","category":"section"},{"location":"quickstart/#Terminology-1","page":"Quickstart","title":"Terminology","text":"","category":"section"},{"location":"quickstart/#","page":"Quickstart","title":"Quickstart","text":"Because CUDA is the most popular GPU programming environment, we can use it as a reference for defining terminology in KA. A workgroup is called a block in NVIDIA CUDA and designates a group of threads acting in parallel, preferably in lockstep. For the GPU, the workgroup size is typically around 256, while for the CPU, it is usually less than or equal to the number of CPU cores. An ndrange is called a grid in NVIDIA CUDA and designates the total number of work items. If using a workgroup of size 1 (non-parallel execution), the ndrange is the number of items to iterate over in a loop.","category":"page"},{"location":"quickstart/#Writing-your-first-kernel-1","page":"Quickstart","title":"Writing your first kernel","text":"","category":"section"},{"location":"quickstart/#","page":"Quickstart","title":"Quickstart","text":"Kernel functions are marked with the @kernel. Inside the @kernel macro you can use the kernel language. As an example, the mul2 kernel below will multiply each element of the array A by 2. It uses the @index macro to obtain the global linear index of the current work item.","category":"page"},{"location":"quickstart/#","page":"Quickstart","title":"Quickstart","text":"@kernel function mul2_kernel(A)\n  I = @index(Global)\n  A[I] = 2 * A[I]\nend","category":"page"},{"location":"quickstart/#Launching-kernel-on-the-host-1","page":"Quickstart","title":"Launching kernel on the host","text":"","category":"section"},{"location":"quickstart/#","page":"Quickstart","title":"Quickstart","text":"You can construct a kernel for a specific backend by calling the kernel with mul2_kernel(CPU(), 16). The first argument is a device of type KA.Device, the second argument being the workgroup size. This returns a generated kernel executable that is then executed with the input argument A and the additional argument being a static ndrange.","category":"page"},{"location":"quickstart/#","page":"Quickstart","title":"Quickstart","text":"A = ones(1024, 1024)\nev = mul2_kernel(CPU(), 16)(A, ndrange=size(A))\nwait(ev)\nall(A .== 2.0)","category":"page"},{"location":"quickstart/#","page":"Quickstart","title":"Quickstart","text":"The kernel eventually returns an event ev. All kernels are launched asynchronously with the event ev specifies the current state of the execution. The [wait] blocks the host until the event ev has completed on the device. This implies that the host will launch no new kernels on any device until the wait returns.","category":"page"},{"location":"quickstart/#Launching-kernel-on-the-device-1","page":"Quickstart","title":"Launching kernel on the device","text":"","category":"section"},{"location":"quickstart/#","page":"Quickstart","title":"Quickstart","text":"To launch the kernel on a backend-supported device isa(device, KA.GPU) (e.g., CUDADevice(), ROCDevice(), oneDevice()), we generate the kernel for this device provided by CUDAKernels, ROCKernels, or oneAPIKernels.","category":"page"},{"location":"quickstart/#","page":"Quickstart","title":"Quickstart","text":"First, we initialize the array using the Array constructor of the chosen device with","category":"page"},{"location":"quickstart/#","page":"Quickstart","title":"Quickstart","text":"using CUDAKernels # Required to access CUDADevice\nA = CuArray(ones(1024, 1024))","category":"page"},{"location":"quickstart/#","page":"Quickstart","title":"Quickstart","text":"using ROCKernels # Required to access CUDADevice\nA = ROCArray(ones(1024, 1024))","category":"page"},{"location":"quickstart/#","page":"Quickstart","title":"Quickstart","text":"using oneAPIKernels # Required to access CUDADevice\nA = oneArray(ones(1024, 1024))","category":"page"},{"location":"quickstart/#","page":"Quickstart","title":"Quickstart","text":"The kernel generation and execution are then","category":"page"},{"location":"quickstart/#","page":"Quickstart","title":"Quickstart","text":"ev = mul2_kernel(device, 16)(A, ndrange=size(A))\nwait(ev)\nall(A .== 2.0)","category":"page"},{"location":"quickstart/#","page":"Quickstart","title":"Quickstart","text":"For simplicity, we stick with the case of device=CUDADevice().","category":"page"},{"location":"quickstart/#Synchronization-1","page":"Quickstart","title":"Synchronization","text":"","category":"section"},{"location":"quickstart/#","page":"Quickstart","title":"Quickstart","text":"danger: Danger\nAll kernel launches are asynchronous, each kernel produces an event token that has to be waited upon, before reading or writing memory that was passed as an argument to the kernel. See dependencies for a full explanation.","category":"page"},{"location":"quickstart/#","page":"Quickstart","title":"Quickstart","text":"The code around KA may heavily rely on GPUArrays, for example, to intialize variables.","category":"page"},{"location":"quickstart/#","page":"Quickstart","title":"Quickstart","text":"using CUDAKernels # Required to access CUDADevice\nfunction mymul(A::CuArray)\n    A .= 1.0\n    ev = mul2_kernel(CUDADevice(), 16)(A, ndrange=size(A))\n    wait(ev)\n    all(A .== 2.0)\nend","category":"page"},{"location":"quickstart/#","page":"Quickstart","title":"Quickstart","text":"These statement-level generated kernels like A .= 1.0 are executed on a different stream than the KA kernels.  Launching mul_kernel may start before A .= 1.0 has completed. To prevent this, we add a device-wide dependency to the kernel by adding dependencies=Event(CUDADevice()).","category":"page"},{"location":"quickstart/#","page":"Quickstart","title":"Quickstart","text":"ev = mul_kernel(CUDADevice(), 16)(A, ndrange=size(A), dependencies=Event(CUDADevice()))","category":"page"},{"location":"quickstart/#","page":"Quickstart","title":"Quickstart","text":"This device dependency requires all kernels on the device to be completed before this kernel is launched. In the same vein, multiple events may be added to a wait.","category":"page"},{"location":"quickstart/#","page":"Quickstart","title":"Quickstart","text":"using CUDAKernels # Required to access CUDADevice\nfunction mymul(A::CuArray, B::CuArray)\n    A .= 1.0\n    B .= 3.0\n    evA = mul2_kernel(CUDADevice(), 16)(A, ndrange=size(A), dependencies=Event(CUDADevice()))\n    evB = mul2_kernel(CUDADevice(), 16)(A, ndrange=size(A), dependencies=Event(CUDADevice()))\n    wait(evA, evB)\n    all(A .+ B .== 8.0)\nend","category":"page"},{"location":"#KernelAbstractions-1","page":"Home","title":"KernelAbstractions","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"KernelAbstractions.jl (KA) is a package that allows you to write GPU-like kernels targetting different execution backends. KA intends to be a minimal and performant library that explores ways to write heterogeneous code. Although parts of the package are still experimental, it has been used successfully as part of the Exascale Computing Project to run Julia code on pre-Frontier and pre-Aurora systems. Currently, profiling and debugging require backend-specific calls like, for example, in CUDA.jl.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"note: Note\nWhile KernelAbstraction.jl is focused on performance portability, it emulates GPU semantics and therefore the kernel language has several constructs that are necessary for good performance on the GPU, but serve no purpose on the CPU. In these cases, we either ignore such statements entirely (such as with @synchronize) or swap out the construct for something similar on the CPU (such as using an MVector  to replace @localmem). This means that CPU performance will still be fast, but might be performing extra work to provide a consistent programming model across GPU and CPU","category":"page"},{"location":"#Supported-backends-1","page":"Home","title":"Supported backends","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"All supported backends rely on their respective Julia interface to the compiler backend and depend on GPUArrays.jl and GPUCompiler.jl. KA provides interface kernel generation modules to those packages in /lib. After loading the kernel packages, KA will provide a KA.Device for that backend to be used in the kernel generation stage.","category":"page"},{"location":"#CUDA-1","page":"Home","title":"CUDA","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"using CUDA\nusing KernelAbstractions\nusing CUDAKernels","category":"page"},{"location":"#","page":"Home","title":"Home","text":"CUDA.jl is currently the most mature way to program for GPUs. This provides a device CUDADevice <: KA.Device to","category":"page"},{"location":"#AMDGPU-1","page":"Home","title":"AMDGPU","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"using AMDGPU\nusing KernelAbstractions\nusing ROCKernels","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Experimental AMDGPU (ROCm) support is available via the AMDGPU.jl and ROCKernels.jl. It provides the device ROCDevice <: KA.Device. Please get in touch with @jpsamaroo for any issues specific to the ROCKernels backend.","category":"page"},{"location":"#oneAPI-1","page":"Home","title":"oneAPI","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"Experimental support for Intel GPUs has also been added through the oneAPI Intel Compute Runtime interfaced to in oneAPI.jl","category":"page"},{"location":"#Semantic-differences-1","page":"Home","title":"Semantic differences","text":"","category":"section"},{"location":"#To-Julia-1","page":"Home","title":"To Julia","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"Functions inside kernels are forcefully inlined, except when marked with @noinline.\nFloating-point multiplication, addition, subtraction are marked contractable.","category":"page"},{"location":"#To-CUDA.jl/AMDGPU.jl-1","page":"Home","title":"To CUDA.jl/AMDGPU.jl","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"The kernels are automatically bounds-checked against either the dynamic or statically provided ndrange.\nFunctions like Base.sin are mapped to CUDA.sin/AMDGPU.sin.","category":"page"},{"location":"#To-GPUifyLoops.jl-1","page":"Home","title":"To GPUifyLoops.jl","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"@scratch has been renamed to @private, and the semantics have changed. Instead of denoting how many dimensions are implicit on the GPU, you only ever provide the explicit number of dimensions that you require. The implicit CPU dimensions are appended.","category":"page"},{"location":"#Contributing-1","page":"Home","title":"Contributing","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"Please file any bug reports through Github issues or fixes through a pull request. Any heterogeneous hardware or code aficionados is welcome to join us on our journey.","category":"page"},{"location":"examples/performance/#Measuring-performance-1","page":"Measuring performance","title":"Measuring performance","text":"","category":"section"},{"location":"examples/performance/#","page":"Measuring performance","title":"Measuring performance","text":"Run under nsight-cu:","category":"page"},{"location":"examples/performance/#","page":"Measuring performance","title":"Measuring performance","text":"nv-nsight-cu-cli --nvtx --profile-from-start=off --section=SpeedOfLight --section=julia --project=examples examples/performance.jl","category":"page"},{"location":"examples/performance/#Results:-1","page":"Measuring performance","title":"Results:","text":"","category":"section"},{"location":"examples/performance/#","page":"Measuring performance","title":"Measuring performance","text":"Collated results on a V100:","category":"page"},{"location":"examples/performance/#","page":"Measuring performance","title":"Measuring performance","text":"Kernel Time Speed of Light Mem %\nnaive (32, 32) 1.19ms 65.06%\nnaive (1024, 1) 1.79ms 56.13 %\nnaive (1, 1024) 3.03ms 60.02 %","category":"page"},{"location":"examples/performance/#Full-output:-1","page":"Measuring performance","title":"Full output:","text":"","category":"section"},{"location":"examples/performance/#","page":"Measuring performance","title":"Measuring performance","text":"==PROF==   0: Naive transpose (32, 32)\n    Section: GPU Speed Of Light\n    ---------------------------------------------------------------------- --------------- ------------------------------\n    Memory Frequency                                                         cycle/usecond                         878.88\n    SOL FB                                                                               %                          38.16\n    Elapsed Cycles                                                                   cycle                      1,447,874\n    SM Frequency                                                             cycle/nsecond                           1.23\n    Memory [%]                                                                           %                          65.93\n    Duration                                                                       msecond                           1.17\n    SOL L2                                                                               %                          19.08\n    SOL TEX                                                                              %                          66.19\n    SM Active Cycles                                                                 cycle                   1,440,706.40\n    SM [%]                                                                               %                          23.56\n    ---------------------------------------------------------------------- --------------- ------------------------------\n\n  ptxcall___gpu_transpose_kernel_naive__430_2, 2020-Feb-20 22:42:24, Context 1, Stream 23\n\n==PROF==   0: Naive transpose (1024, 1)\n    Section: GPU Speed Of Light\n    ---------------------------------------------------------------------- --------------- ------------------------------\n    Memory Frequency                                                         cycle/usecond                         877.69\n    SOL FB                                                                               %                          22.40\n    Elapsed Cycles                                                                   cycle                      2,473,141\n    SM Frequency                                                             cycle/nsecond                           1.23\n    Memory [%]                                                                           %                          51.17\n    Duration                                                                       msecond                           2.00\n    SOL L2                                                                               %                          50.17\n    SOL TEX                                                                              %                          51.27\n    SM Active Cycles                                                                 cycle                   2,465,610.06\n    SM [%]                                                                               %                          11.68\n    ---------------------------------------------------------------------- --------------- ------------------------------\n\n  ptxcall___gpu_transpose_kernel_naive__430_3, 2020-Feb-20 22:42:28, Context 1, Stream 25\n\n==PROF==   0: Naive transpose (1, 1024)\n    Section: GPU Speed Of Light\n    ---------------------------------------------------------------------- --------------- ------------------------------\n    Memory Frequency                                                         cycle/usecond                         876.69\n    SOL FB                                                                               %                          17.88\n    Elapsed Cycles                                                                   cycle                      3,737,127\n    SM Frequency                                                             cycle/nsecond                           1.24\n    Memory [%]                                                                           %                          60.02\n    Duration                                                                       msecond                           3.02\n    SOL L2                                                                               %                          60.02\n    SOL TEX                                                                              %                          45.65\n    SM Active Cycles                                                                 cycle                   3,732,591.59\n    SM [%]                                                                               %                          12.56\n    ---------------------------------------------------------------------- --------------- ------------------------------","category":"page"},{"location":"examples/performance/#Code-1","page":"Measuring performance","title":"Code","text":"","category":"section"},{"location":"examples/performance/#","page":"Measuring performance","title":"Measuring performance","text":"using Markdown\nusing KernelAbstractions\npath = joinpath(dirname(pathof(KernelAbstractions)), \"..\", \"examples/performance.jl\")\nMarkdown.parse(\"\"\"\n```julia\n$(read(path, String))\n```\n\"\"\")","category":"page"},{"location":"examples/matmul/#Matmul-1","page":"Matmul","title":"Matmul","text":"","category":"section"},{"location":"examples/matmul/#","page":"Matmul","title":"Matmul","text":"using Markdown\nusing KernelAbstractions\npath = joinpath(dirname(pathof(KernelAbstractions)), \"..\", \"examples/matmul.jl\")\nMarkdown.parse(\"\"\"\n```julia\n$(read(path, String))\n```\n\"\"\")","category":"page"}]
}
